// Prepara Selección (la propuesta elegida) y los recorridos para enseñarse como web: fuentes servidas desde
// la propia web (sin terceros, sin banner de cookies), páginas legales y enlaces a ellas. Se puede repetir:
// hay que pasarlo de nuevo cada vez que se regenera seleccion/ o un recorrido. Uso: node herramientas/legal.mjs
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { legales } from "./legales.mjs";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const FUENTES = /<link rel="preconnect"[^>]*>\s*|<link href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/g;
const HOJA = '<link rel="stylesheet" href="../recursos/fuentes/fuentes.css">';
const NOINDEX = '<meta name="robots" content="noindex">';
const ENLACES = '<a href="../aviso-legal/">Aviso legal</a> · <a href="../privacidad/">Privacidad</a> · <a href="../cookies/">Cookies</a>';

function preparar(ruta, cambiar) {
  let html = readFileSync(ruta, "utf8").replace(FUENTES, "");
  if (!html.includes(HOJA)) html = html.replace("<style>", `${NOINDEX}\n${HOJA}\n<style>`);
  if (!html.includes('href="../aviso-legal/"')) html = cambiar(html);
  writeFileSync(ruta, html);
}

preparar(`${RAIZ}/seleccion/index.html`, (html) => {
  if (!html.includes("</a></span></div></footer>")) throw new Error("Selección: pie inesperado");
  return html.replace("</a></span></div></footer>", `</a></span><span>${ENLACES}</span></div></footer>`);
});

const recorridos = readdirSync(RAIZ).filter((d) => d.startsWith("recorrido-") && d !== "recorrido-3d");
for (const r of recorridos) {
  preparar(`${RAIZ}/${r}/index.html`, (html) => {
    if (!/<\/section>\s*<\/main>/.test(html)) throw new Error(`${r}: no tiene cierre con sección`);
    return html
      .replace(/<\/section>\s*<\/main>/, `  <p class="legal">${ENLACES}</p>\n  </section>\n</main>`)
      .replace("</style>", "  .legal { margin-top: 28px; font-size: 12px; color: var(--suave); } .legal a { color: inherit; }\n</style>")
      .replace('<a class="marca" href="../">', '<a class="marca" href="../seleccion/">');
  });
}

for (const [ruta, pagina] of Object.entries(legales)) {
  mkdirSync(`${RAIZ}/${ruta}`, { recursive: true });
  writeFileSync(`${RAIZ}/${ruta}/index.html`, pagina);
}
console.log("Listo: seleccion,", recorridos.join(", "), "y páginas legales");
