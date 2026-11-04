// Descarga una vez las fuentes de Google (subconjunto latino, suficiente para el español) para servirlas
// desde la propia web. Uso: node herramientas/fuentes.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const FAMILIAS = [
  "Source+Serif+4:opsz,wght@8..60,400;8..60,500",
  "Instrument+Sans:wght@400;500;600",
  "Instrument+Serif:ital@0;1",
  "Geist:wght@400;500",
];
const NAVEGADOR = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const dir = new URL("../recursos/fuentes/", import.meta.url);
mkdirSync(dir, { recursive: true });

const url = `https://fonts.googleapis.com/css2?${FAMILIAS.map((f) => `family=${f}`).join("&")}&display=swap`;
const css = await (await fetch(url, { headers: { "User-Agent": NAVEGADOR } })).text();
const bloques = css.split(/(?=\/\* )/).filter((b) => b.startsWith("/* latin */"));
// Las fuentes variables repiten el mismo archivo para cada peso: se descarga una sola vez.
const nombres = new Map();
let salida = "";
for (const b of bloques) {
  const familia = b.match(/font-family: '([^']+)'/)[1].replace(/\s+/g, "-").toLowerCase();
  const estilo = b.match(/font-style: (\w+)/)[1];
  const remoto = b.match(/url\((https:[^)]+\.woff2)\)/)[1];
  if (!nombres.has(remoto)) {
    const nombre = `${familia}-${estilo}.woff2`;
    writeFileSync(new URL(nombre, dir), Buffer.from(await (await fetch(remoto)).arrayBuffer()));
    nombres.set(remoto, nombre);
  }
  salida += b.replace(remoto, nombres.get(remoto)).replace("/* latin */\n", "");
}
writeFileSync(new URL("fuentes.css", dir), salida);
console.log(bloques.length, "fuentes");
