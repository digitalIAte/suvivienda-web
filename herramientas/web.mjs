// Convierte Selección (la propuesta elegida) y los recorridos en una web independiente de la plataforma:
// buscador y fichas propios, fuentes servidas desde el sitio (sin terceros ni cookies) y páginas legales.
// Se puede repetir; hay que pasarlo cada vez que se regenera seleccion/ o un recorrido. Uso: node herramientas/web.mjs
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { legales } from "./legales.mjs";
import { buscar, ficha, inmuebles } from "./paginas.mjs";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const PLATAFORMA = "suvivienda.digitaliate.es";
const FUENTES = /<link rel="preconnect"[^>]*>\s*|<link href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/g;
const HOJA = '<link rel="stylesheet" href="../recursos/fuentes/fuentes.css">';
const NOINDEX = '<meta name="robots" content="noindex">';
const ENLACES = '<a href="../aviso-legal/">Aviso legal</a> · <a href="../privacidad/">Privacidad</a> · <a href="../cookies/">Cookies</a>';

// Las fichas de la plataforma acaban en la referencia: .../inmueble/piso-en-venta-huesca-sv-0012
const sinPlataforma = (html) => html
  .replace(/https:\/\/suvivienda\.digitaliate\.es\/inmueble\/[a-z0-9-]*?(sv-\d{4})/g, "../inmueble/$1/")
  .replace(/https:\/\/suvivienda\.digitaliate\.es\/(comprar|alquilar)\?/g, "../buscar/?op=$1&amp;")
  .replace(/https:\/\/suvivienda\.digitaliate\.es\/(comprar|alquilar)/g, "../buscar/?op=$1");

function preparar(ruta, cambiar) {
  let html = readFileSync(ruta, "utf8").replace(FUENTES, "");
  if (!html.includes(HOJA)) html = html.replace("<style>", `${NOINDEX}\n${HOJA}\n<style>`);
  html = cambiar(sinPlataforma(html));
  if (html.includes(PLATAFORMA)) throw new Error(`${ruta}: aún enlaza a la plataforma`);
  writeFileSync(ruta, html);
}

// Cada cambio se aplica una sola vez: si ya está hecho se salta, y si no aparece ni hecho ni por hacer, falla.
function aplicar(html, cambios, donde) {
  for (const [de, a] of cambios) {
    if (html.includes(a)) continue;
    if (!html.includes(de)) throw new Error(`${donde}: no aparece ${de.slice(0, 50)}`);
    html = html.replace(de, a);
  }
  return html;
}

preparar(`${RAIZ}/seleccion/index.html`, (html) => aplicar(html, [
  ["</a></span></div></footer>", `</a></span><span>${ENLACES}</span></div></footer>`],
  ['<form class="buscar" data-buscador method="get">', '<form class="buscar" data-buscador method="get" action="../buscar/"><input type="hidden" name="op" value="comprar">'],
  ["f.action = `${PLATAFORMA}/${op}`;", "f.elements.op.value = op;"],
  ['  const PLATAFORMA = "https://suvivienda.digitaliate.es";\n', "  // Web independiente: sin enlaces a la plataforma.\n"],
  ["// El buscador envía a la cartera real de la plataforma;", "// El buscador lleva a la búsqueda propia de la web;"],
  ['document.querySelectorAll(`a[href$="${ref}"]`)', 'document.querySelectorAll(`a[href*="/${ref}/"]`)'],
], "Selección"));

const recorridos = readdirSync(RAIZ).filter((d) => d.startsWith("recorrido-") && d !== "recorrido-3d");
for (const r of recorridos) {
  preparar(`${RAIZ}/${r}/index.html`, (html) => {
    if (!html.includes('class="legal"')) {
      if (!/<\/section>\s*<\/main>/.test(html)) throw new Error(`${r}: no tiene cierre con sección`);
      html = html.replace(/<\/section>\s*<\/main>/, `  <p class="legal">${ENLACES}</p>\n  </section>\n</main>`);
    }
    return aplicar(html, [
      ["</style>", "  .legal { margin-top: 28px; font-size: 12px; color: var(--suave); } .legal a { color: inherit; }\n</style>"],
      ['<a class="marca" href="../">', '<a class="marca" href="../seleccion/">'],
    ], r);
  });
}

const escribir = (ruta, html) => {
  mkdirSync(`${RAIZ}/${ruta}`, { recursive: true });
  writeFileSync(`${RAIZ}/${ruta}/index.html`, html);
};
const lista = inmuebles();
lista.forEach((i) => escribir(`inmueble/${i.slug}`, ficha(i)));
escribir("buscar", buscar(lista));
Object.entries(legales).forEach(([ruta, html]) => escribir(ruta, html));
console.log(`Listo: seleccion, ${recorridos.length} recorridos, buscar, ${lista.length} fichas y páginas legales`);
