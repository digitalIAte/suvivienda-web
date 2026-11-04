// Textos legales de la propuesta elegida (Selección). Parten de los de la plataforma (app/(web)/{aviso-legal,privacidad,cookies})
// adaptados a lo que hace esta web: sin formularios, sin cookies y alojada en GitHub Pages.
const EMPRESA = {
  razonSocial: "INMOHUESCA ASESORES INMOBILIARIOS, S.L.",
  nif: "B-22408165",
  domicilio: "Calle Fatás, 6, 22002 Huesca",
  telefono: "974 353 641",
  email: "info@suviviendahuesca.com",
};
const PLATAFORMA = "https://suvivienda.digitaliate.es";

function pagina(titulo, cuerpo) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${titulo} | SuVivienda</title>
<link rel="stylesheet" href="../recursos/fuentes/fuentes.css">
<style>
  :root { --tinta: #1c1c1e; --gris: #5f5f64; --linea: #e2e2e4; --rojo: #b81f30; }
  * { box-sizing: border-box; margin: 0; }
  body { background: #fff; color: var(--tinta); font: 400 17px/1.65 "Instrument Sans", system-ui, sans-serif; }
  header, main, footer { max-width: 760px; margin: 0 auto; padding-inline: 20px; }
  header { padding-block: 22px; border-bottom: 1px solid var(--linea); }
  header img { display: block; height: 46px; width: auto; }
  main { padding-block: 48px 72px; }
  h1 { font: 500 clamp(36px, 6vw, 52px)/1.05 "Source Serif 4", Georgia, serif; letter-spacing: -.01em; margin-bottom: 28px; }
  h2 { font: 500 22px/1.3 "Source Serif 4", Georgia, serif; margin: 36px 0 10px; }
  p, ul { color: #333; } p + p, ul + p { margin-top: 12px; } ul { padding-left: 20px; margin-top: 8px; }
  a { color: var(--rojo); }
  footer { padding-block: 24px; border-top: 1px solid var(--linea); font-size: 14px; color: var(--gris); display: flex; flex-wrap: wrap; gap: 8px 24px; justify-content: space-between; }
  footer a { color: inherit; }
</style>
</head>
<body>
<header><a href="../seleccion/"><img src="../recursos/logo.png" alt="SuVivienda, volver a la portada"></a></header>
<main>
<h1>${titulo}</h1>
${cuerpo}
</main>
<footer><span>${EMPRESA.razonSocial} NIF ${EMPRESA.nif}</span><span><a href="../aviso-legal/">Aviso legal</a> · <a href="../privacidad/">Privacidad</a> · <a href="../cookies/">Cookies</a></span></footer>
</body>
</html>
`;
}

const titular = `<p><strong>Denominación:</strong> ${EMPRESA.razonSocial}<br><strong>NIF:</strong> ${EMPRESA.nif}<br>
<strong>Nombre comercial:</strong> SuVivienda<br><strong>Domicilio:</strong> ${EMPRESA.domicilio}<br>
<strong>Teléfono:</strong> ${EMPRESA.telefono}<br><strong>Email:</strong> <a href="mailto:${EMPRESA.email}">${EMPRESA.email}</a></p>`;

export const legales = {
  "aviso-legal": pagina("Aviso legal", `<h2>Titular del sitio web</h2>
${titular}
<h2>Objeto</h2>
<p>Este sitio web ofrece información sobre los servicios de intermediación inmobiliaria prestados por SuVivienda en Huesca y provincia, así como sobre los inmuebles disponibles en cada momento.</p>
<h2>Condiciones de uso</h2>
<p>El acceso a este sitio es gratuito. El usuario se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para actividades ilícitas o contrarias a la buena fe.</p>
<h2>Información sobre los inmuebles</h2>
<p>Los datos de superficie, distribución, precios y características de los inmuebles son orientativos y no tienen carácter contractual. Pueden variar sin previo aviso y deben verificarse antes de cualquier operación. Las imágenes son ilustrativas.</p>
<h2>Recorridos en vídeo</h2>
<p>Los recorridos de las viviendas se han generado con inteligencia artificial a partir de fotografías reales y así se indica en cada uno. Cuando muestran una reforma que aún no se ha hecho, se rotulan como recreación virtual de la reforma propuesta. No sustituyen a la visita del inmueble.</p>
<h2>Propiedad intelectual</h2>
<p>Los contenidos de este sitio (textos, imágenes, vídeos, marcas y diseño) pertenecen a SuVivienda o a terceros que han autorizado su uso. No se permite su reproducción sin autorización expresa.</p>
<h2>Responsabilidad</h2>
<p>SuVivienda no se responsabiliza de los daños derivados del uso de este sitio ni de la disponibilidad continuada del servicio, aunque procura mantenerlo operativo y actualizado.</p>
<h2>Legislación aplicable</h2>
<p>Esta relación se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Huesca, salvo que la ley disponga otro fuero.</p>`),

  privacidad: pagina("Política de privacidad", `<p>En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y de la Ley Orgánica 3/2018 (LOPDGDD), te informamos de cómo tratamos tus datos personales.</p>
<h2>Responsable del tratamiento</h2>
<p>${EMPRESA.razonSocial}, NIF ${EMPRESA.nif}, ${EMPRESA.domicilio}. Email: <a href="mailto:${EMPRESA.email}">${EMPRESA.email}</a>. Teléfono: ${EMPRESA.telefono}.</p>
<h2>Qué datos recogemos</h2>
<p>Esta web no tiene formularios ni cuentas de usuario. Solo tratamos los datos que tú nos das al escribirnos por correo o al llamarnos: normalmente tu nombre, tu teléfono, tu email y lo que nos cuentes en el mensaje. Si nos pides una valoración, además la zona o la calle de tu vivienda.</p>
<h2>Para qué los usamos</h2>
<ul>
<li>Responder a tu consulta y gestionar tu interés en un inmueble.</li>
<li>Llamarte para valorar tu vivienda cuando lo solicitas.</li>
<li>Mantener el contacto durante el proceso de compra, venta o alquiler.</li>
</ul>
<p>No usamos tus datos para enviarte publicidad no solicitada ni los cedemos a terceros con fines comerciales.</p>
<h2>Base legal</h2>
<p>El consentimiento que nos das al contactar con nosotros y, en su caso, la aplicación de medidas precontractuales a petición tuya.</p>
<h2>Cuánto tiempo los conservamos</h2>
<p>Mientras dure la relación y, después, durante los plazos legales de prescripción aplicables. Si nos pides que los eliminemos y no hay obligación legal de conservarlos, los borramos.</p>
<h2>Destinatarios</h2>
<p>Tus datos se alojan en servidores de proveedores tecnológicos que actúan como encargados del tratamiento. Solo se comunican a terceros (notarías, administraciones, entidades financieras) cuando es necesario para la operación que nos encargas o lo exige la ley.</p>
<h2>Alojamiento de esta web</h2>
<p>Esta web se sirve desde GitHub Pages (GitHub, Inc.), que, como cualquier servidor, recibe la dirección IP de quien la visita y la guarda durante un tiempo limitado por motivos de seguridad. GitHub puede tratar esos datos en Estados Unidos con las garantías previstas en el RGPD.</p>
<p>El buscador y las fichas de los inmuebles te llevan a nuestra plataforma en <a href="${PLATAFORMA}">${PLATAFORMA.replace("https://", "")}</a>, que tiene su propia <a href="${PLATAFORMA}/privacidad">política de privacidad</a>.</p>
<h2>Tus derechos</h2>
<p>Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a <a href="mailto:${EMPRESA.email}">${EMPRESA.email}</a> o a nuestra dirección postal, adjuntando copia de un documento que acredite tu identidad. También puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es">www.aepd.es</a>).</p>`),

  cookies: pagina("Política de cookies", `<h2>Esta web no usa cookies</h2>
<p>No instalamos cookies de ningún tipo: ni técnicas, ni de analítica, ni de publicidad. Tampoco guardamos nada en tu navegador ni te seguimos entre páginas. Por eso no te pedimos que aceptes nada al entrar.</p>
<h2>Contenido de terceros</h2>
<p>Las tipografías, las fotos y los vídeos se sirven desde esta misma web, sin conectar con servicios externos. Solo los enlaces a redes sociales y a nuestra plataforma te llevan a otros sitios, y únicamente cuando los pulsas. Esos sitios tienen sus propias políticas de cookies; la de nuestra plataforma está en <a href="${PLATAFORMA}/cookies">${PLATAFORMA.replace("https://", "")}/cookies</a>.</p>
<h2>Cómo gestionar las cookies</h2>
<p>Aunque aquí no las usamos, puedes bloquear o eliminar las cookies de cualquier web desde la configuración de tu navegador.</p>
<h2>Dudas</h2>
<p>Si tienes cualquier pregunta sobre esta política, escríbenos a <a href="mailto:${EMPRESA.email}">${EMPRESA.email}</a>.</p>`),
};
