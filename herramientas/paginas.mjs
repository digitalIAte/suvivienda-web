// Búsqueda y fichas propias de Selección, para que la web funcione sin la plataforma. Los datos son una copia
// fija de la cartera (datos/inmuebles.json): si cambia un anuncio hay que volver a extraerla y regenerar.
import { existsSync, readFileSync } from "node:fs";

const RAIZ = new URL("..", import.meta.url);
const DATOS = new URL("../../datos/inmuebles.json", import.meta.url);
const CONTACTO = { telefono: "974 353 641", tel: "+34974353641", movil: "648 581 170", whatsapp: "34648581170", email: "info@suviviendahuesca.com" };
const LEGAL = '<a href="../../aviso-legal/">Aviso legal</a> · <a href="../../privacidad/">Privacidad</a> · <a href="../../cookies/">Cookies</a>';

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const miles = (n) => new Intl.NumberFormat("de-DE").format(n);
const normal = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function recorridos() {
  const html = readFileSync(new URL("seleccion/index.html", RAIZ), "utf8");
  return JSON.parse(html.match(/const RECORRIDOS = (\{[^;]+\});/)[1]);
}

export function inmuebles() {
  return JSON.parse(readFileSync(DATOS, "utf8")).map((i) => {
    const ref = i.referencia.toLowerCase();
    return {
      ref: i.referencia, slug: ref, titulo: i.titulo, precio: i.precio, alquiler: i.alquiler,
      tipo: i.tipoYOperacion.split("·")[0].trim(), localidad: i.localidad, m2: i.superficie, hab: i.habitaciones,
      caracteristicas: i.caracteristicas ?? {}, descripcion: i.descripcion ?? "",
      foto: existsSync(new URL(`recursos/fotos/${i.referencia}.jpg`, RAIZ)),
      recorrido: recorridos()[ref] ?? null,
    };
  });
}

const precio = (i) => `${miles(i.precio)} €${i.alquiler ? "/mes" : ""}`;
const detalles = (i) => [i.m2 && `${miles(i.m2)} m²`, i.hab && `${i.hab} hab.`, i.localidad].filter(Boolean).join(", ");

const CSS = `
  :root { --tinta: #1c1c1e; --gris: #5f5f64; --linea: #e2e2e4; --suave: #f5f5f4; --rojo: #b81f30; --serif: "Source Serif 4", Georgia, serif; }
  * { box-sizing: border-box; margin: 0; }
  html { background: #fff; color: var(--tinta); font: 400 16px/1.55 "Instrument Sans", system-ui, sans-serif; }
  a { color: inherit; } button, select { font: inherit; color: inherit; }
  .marco { max-width: 1240px; margin: 0 auto; padding: 0 32px; }
  .barra { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding-block: 6px; border-bottom: 1px solid var(--linea); }
  .barra img { display: block; width: 260px; max-width: 58vw; height: auto; }
  .barra a.tel { font-weight: 600; text-decoration: none; white-space: nowrap; }
  h1 { font-family: var(--serif); font-weight: 400; font-size: clamp(32px, 4.4vw, 54px); line-height: 1.1; letter-spacing: -.012em; }
  h2 { font-family: var(--serif); font-weight: 500; font-size: 24px; margin: 36px 0 12px; }
  .volver { display: inline-block; margin: 26px 0 18px; font-size: 14px; font-weight: 500; color: var(--gris); }
  .boton { display: inline-block; background: var(--rojo); color: #fff; border: 0; padding: 12px 26px; font-weight: 600; text-decoration: none; cursor: pointer; text-align: center; transition: background .2s; }
  .boton:hover { background: #971725; }
  .linea { display: block; border: 1px solid var(--tinta); padding: 11px 20px; font-weight: 600; text-decoration: none; text-align: center; transition: background .2s, color .2s; }
  .linea:hover { background: var(--tinta); color: #fff; }
  .sinfoto { display: grid; place-items: center; height: 100%; padding: 16px; text-align: center; color: var(--gris); font-size: 14px; background: var(--suave); }
  .sinfoto b { display: block; font-family: var(--serif); font-weight: 400; font-size: 22px; color: var(--tinta); }
  footer { border-top: 1px solid var(--linea); margin-top: 72px; font-size: 14px; color: var(--gris); }
  footer .marco { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px 28px; padding-block: 26px; }
  @media (max-width: 760px) { .marco { padding: 0 18px; } }`;

function pagina({ titulo, descripcion, estilos, cuerpo, script = "" }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(titulo)} | SuVivienda</title>
<meta name="description" content="${esc(descripcion)}">
<link rel="stylesheet" href="../../recursos/fuentes/fuentes.css">
<style>${CSS}${estilos}
</style>
</head>
<body>
<header class="marco barra"><a href="../../seleccion/"><img src="../../recursos/logo.png" width="315" height="113" alt="SuVivienda, volver a la portada"></a><a class="tel" href="tel:${CONTACTO.tel}">${CONTACTO.telefono}</a></header>
${cuerpo}
<footer><div class="marco"><span>INMOHUESCA ASESORES INMOBILIARIOS, S.L. <span style="white-space:nowrap">NIF B-22408165</span></span><span>${LEGAL}</span></div></footer>
${script}
</body>
</html>
`;
}

export function ficha(i) {
  const asunto = encodeURIComponent(`Interesado en ${i.ref}: ${i.titulo}`);
  const whatsapp = encodeURIComponent(`Hola, me interesa el inmueble ${i.ref} (${i.titulo}).`);
  const imagen = i.foto
    ? `<img src="../../recursos/fotos/${i.ref}.jpg" alt="${esc(i.titulo)}">`
    : `<div class="sinfoto"><p><b>Fotos disponibles bajo petición</b>Llámanos y te las enviamos.</p></div>`;
  const recorrido = i.recorrido
    ? `<a class="boton recorrer" href="../../${i.recorrido[0].replace(/^\.\.\//, "")}">${esc(i.recorrido[1])}</a>` : "";
  const datos = Object.entries(i.caracteristicas).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
  const texto = i.descripcion.split(/\n{2,}/).map((p) => `<p>${esc(p)}</p>`).join("\n");
  return pagina({
    titulo: i.titulo,
    descripcion: `${i.titulo}. ${precio(i)}. Ref. ${i.ref}.`,
    estilos: `
  .ficha { display: grid; grid-template-columns: minmax(0, 7fr) minmax(280px, 4fr); gap: 48px; align-items: start; }
  figure { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: var(--suave); }
  figure img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .recorrer { position: absolute; left: 18px; bottom: 18px; }
  .ref { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: var(--gris); margin-bottom: 8px; }
  .texto p { color: #333; max-width: 68ch; } .texto p + p { margin-top: 12px; }
  dl { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0 24px; }
  dl div { border-top: 1px solid var(--linea); padding: 10px 0; } dt { font-size: 13px; color: var(--gris); } dd { font-weight: 500; }
  aside { position: sticky; top: 24px; border: 1px solid var(--linea); padding: 26px; display: grid; gap: 12px; }
  aside .precio { font-family: var(--serif); font-size: 40px; line-height: 1.1; }
  aside p { color: var(--gris); font-size: 14px; }
  .precio-movil { display: none; }
  @media (max-width: 860px) {
    .ficha { grid-template-columns: 1fr; gap: 28px; } aside { position: static; }
    .precio-movil { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
    .precio-movil b { font-family: var(--serif); font-weight: 400; font-size: 32px; }
    .precio-movil a { background: var(--rojo); color: #fff; padding: 10px 22px; font-weight: 600; text-decoration: none; }
  }`,
    cuerpo: `<main class="marco">
<a class="volver" href="../../buscar/?op=${i.alquiler ? "alquilar" : "comprar"}">← Ver más inmuebles en ${i.alquiler ? "alquiler" : "venta"}</a>
<div class="ficha">
<div>
<p class="ref">${esc(i.tipo)} en ${i.alquiler ? "alquiler" : "venta"} · Ref. ${i.ref}</p>
<h1>${esc(i.titulo)}</h1>
<p class="precio-movil"><b>${precio(i)}</b><a href="tel:${CONTACTO.tel}">Llamar</a></p>
<figure style="margin-top:24px">${imagen}${recorrido}</figure>
${datos ? `<h2>Características</h2><dl>${datos}</dl>` : ""}
<h2>Descripción</h2>
<div class="texto">${texto}</div>
</div>
<aside>
<span class="precio">${precio(i)}</span>
<p>${esc(detalles(i))}</p>
<a class="boton" href="tel:${CONTACTO.tel}">Llamar al ${CONTACTO.telefono}</a>
<a class="linea" href="https://wa.me/${CONTACTO.whatsapp}?text=${whatsapp}">WhatsApp ${CONTACTO.movil}</a>
<a class="linea" href="mailto:${CONTACTO.email}?subject=${asunto}">Escribir un correo</a>
<p>Oficina en Calle Fatás 6, Huesca. Te enseñamos el inmueble cuando te venga bien.</p>
</aside>
</div>
</main>`,
  });
}

export function buscar(lista) {
  const datos = lista.map((i) => ({
    ref: i.ref, slug: i.slug, t: i.titulo, p: i.precio, alq: i.alquiler, tipo: normal(i.tipo), loc: i.localidad,
    hab: i.hab, d: detalles(i), foto: i.foto,
  }));
  const tipos = [...new Map(lista.map((i) => [normal(i.tipo), i.tipo])).entries()];
  const zonas = [...new Set(lista.map((i) => i.localidad))].sort((a, b) => a.localeCompare(b, "es"));
  return pagina({
    titulo: "Buscar inmuebles en Huesca",
    descripcion: "Pisos, casas, locales, garajes y terrenos en venta y alquiler en Huesca y provincia.",
    estilos: `
  .cabeza { padding-block: 40px 8px; }
  .cabeza p { color: var(--gris); margin-top: 6px; }
  form { display: grid; grid-template-columns: auto repeat(3, 1fr) auto; gap: 10px; align-items: end; padding: 18px 0 28px; border-bottom: 1px solid var(--linea); }
  .ops { display: flex; gap: 18px; align-self: center; }
  .ops label { cursor: pointer; font-weight: 600; color: var(--gris); border-bottom: 2px solid transparent; padding: 2px 0; }
  .ops input { position: absolute; opacity: 0; }
  .ops label:has(input:checked) { color: var(--tinta); border-color: var(--rojo); }
  .ops label:has(input:focus-visible) { outline: 2px solid var(--rojo); outline-offset: 3px; }
  form > label { display: grid; gap: 4px; font-size: 13px; font-weight: 500; }
  select { padding: 11px 10px; border: 1px solid #c9c9cd; background: #fff; width: 100%; }
  .tarjetas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px 20px; margin-top: 32px; }
  .tarjeta { text-decoration: none; display: block; }
  .tarjeta figure { aspect-ratio: 4 / 3; overflow: hidden; background: var(--suave); }
  .tarjeta img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .9s cubic-bezier(.16,1,.3,1); }
  .tarjeta:hover img { transform: scale(1.04); }
  .tarjeta b { display: block; font-family: var(--serif); font-weight: 500; font-size: 26px; margin-top: 12px; }
  .tarjeta h3 { font-weight: 500; font-size: 16px; line-height: 1.35; margin-top: 2px; }
  .tarjeta p { color: var(--gris); font-size: 14px; margin-top: 2px; }
  .tarjeta .rec { display: block; margin-top: 6px; font-weight: 600; font-size: 14px; color: var(--rojo); }
  .vacio { margin-top: 40px; padding: 40px; text-align: center; border: 1px dashed #c9c9cd; }
  .vacio p { color: var(--gris); margin: 6px 0 18px; }
  @media (max-width: 900px) { form { grid-template-columns: 1fr 1fr; } .ops { grid-column: 1 / -1; } .tarjetas { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .tarjetas { grid-template-columns: 1fr; } }`,
    cuerpo: `<main class="marco">
<div class="cabeza"><h1 data-titulo>Inmuebles en venta</h1><p data-cuenta></p></div>
<form method="get">
<div class="ops" role="radiogroup" aria-label="Operación"><label><input type="radio" name="op" value="comprar" checked>Comprar</label><label><input type="radio" name="op" value="alquilar">Alquilar</label></div>
<label>Tipo<select name="tipo"><option value="">Todos</option>${tipos.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join("")}</select></label>
<label>Zona<select name="localidad"><option value="">Toda la provincia</option>${zonas.map((z) => `<option>${esc(z)}</option>`).join("")}</select></label>
<label>Precio máximo<select name="precio_max"><option value="">Sin límite</option></select></label>
<button class="boton">Buscar</button>
</form>
<div class="tarjetas" data-resultados></div>
</main>`,
    script: `<script>
  const INMUEBLES = ${JSON.stringify(datos)};
  const RECORRIDOS = ${JSON.stringify(Object.fromEntries(lista.filter((i) => i.recorrido).map((i) => [i.slug, i.recorrido[1]])))};
  const TOPES = { comprar: [100000, 200000, 400000, 700000], alquilar: [500, 800, 1200, 2000] };
  const form = document.querySelector("form");
  const q = new URLSearchParams(location.search);
  const op = q.get("op") === "alquilar" ? "alquilar" : "comprar";
  const miles = (n) => new Intl.NumberFormat("de-DE").format(n);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function topes(o) {
    const sel = form.precio_max, actual = sel.value;
    sel.length = 1;
    TOPES[o].forEach((t) => sel.add(new Option(miles(t) + (o === "alquilar" ? " €/mes" : " €"), t)));
    sel.value = actual;
  }
  form.querySelector('[value="' + op + '"]').checked = true;
  topes(op);
  ["tipo", "localidad", "precio_max"].forEach((c) => { if (q.get(c)) form[c].value = q.get(c); });
  form.querySelectorAll('[name="op"]').forEach((r) => r.addEventListener("change", () => { form.precio_max.value = ""; topes(r.value); }));
  // Los campos vacíos no se mandan para que la dirección quede limpia y se pueda compartir.
  form.addEventListener("submit", () => {
    form.querySelectorAll("select").forEach((c) => { if (!c.value) c.disabled = true; });
    setTimeout(() => form.querySelectorAll("[disabled]").forEach((c) => (c.disabled = false)));
  });

  const tope = Number(form.precio_max.value) || Infinity;
  const encontrados = INMUEBLES.filter((i) => i.alq === (op === "alquilar")
    && (!form.tipo.value || i.tipo === form.tipo.value)
    && (!form.localidad.value || i.loc === form.localidad.value)
    && i.p <= tope);
  document.querySelector("[data-titulo]").textContent = op === "alquilar" ? "Inmuebles en alquiler" : "Inmuebles en venta";
  document.title = document.querySelector("[data-titulo]").textContent + " | SuVivienda";
  document.querySelector("[data-cuenta]").textContent = encontrados.length === 1 ? "1 inmueble" : encontrados.length + " inmuebles";
  const caja = document.querySelector("[data-resultados]");
  if (!encontrados.length) {
    caja.outerHTML = '<div class="vacio"><b>No tenemos nada con esos filtros ahora mismo</b><p>Cuéntanos qué buscas y te avisamos cuando entre algo parecido.</p><a class="boton" href="tel:+34974353641">Llamar al 974 353 641</a></div>';
  } else {
    caja.innerHTML = encontrados.map((i) => '<a class="tarjeta" href="../inmueble/' + i.slug + '/"><figure>'
      + (i.foto ? '<img loading="lazy" src="../recursos/fotos/' + i.ref + '.jpg" alt="">' : '<div class="sinfoto"><p><b>Ref. ' + i.ref + '</b>Fotos bajo petición</p></div>')
      + '</figure><b>' + miles(i.p) + (i.alq ? " €/mes" : " €") + '</b><h3>' + esc(i.t) + '</h3><p>' + esc(i.d) + '</p>'
      + (RECORRIDOS[i.slug] ? '<span class="rec">' + esc(RECORRIDOS[i.slug]) + '</span>' : "") + '</a>').join("");
  }
</script>`,
  }).replaceAll("../../", "../");
}
