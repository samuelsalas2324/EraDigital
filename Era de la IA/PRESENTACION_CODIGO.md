# Recordatorio de Salud — Explicación técnica del código

Documento de apoyo para la sustentación. Sigue el orden en el que conviene
proyectar el código: primero **qué problema resuelve**, después `index.html`,
después `app.js`, y al final las preguntas que probablemente le hagan.

---

## 0. La idea en una frase

> Una misma aplicación de recordatorios de medicación que **cambia su forma de
> hablar** según el territorio de quien la usa, en lugar de obligar a todos a
> entender un único español clínico.

Tres archivos, sin frameworks, sin backend, sin base de datos:

| Archivo | Qué contiene | Líneas aprox. |
|---|---|---|
| `index.html` | Estructura de la interfaz y el sprite de iconos | 434 |
| `app.js` | Los datos culturales y toda la lógica | 930 |
| `style.css` | Componentes con estado, animación y respaldo sin conexión | 418 |

**Stack:** HTML5 semántico + Tailwind CSS (vía CDN) + JavaScript *vanilla*.
No hay librerías, ni `npm install`, ni proceso de compilación. Se abre con
Live Server y funciona.

---

## 1. `index.html` — la estructura

### 1.1 Cabeza del documento

```html
<html lang="es">
```
`lang="es"` no es decorativo: es lo que le dice al lector de pantalla en qué
idioma pronunciar el contenido.

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  if (!window.tailwind) {
    document.documentElement.classList.add("sin-tailwind");
  } else {
    tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter', ...] } } } };
  }
</script>
```

**Punto fuerte para defender.** Si el CDN no responde —porque no hay internet,
que es justamente la condición de las zonas donde vive el usuario objetivo— la
aplicación no se rompe: le pone la clase `sin-tailwind` al `<html>` y `style.css`
aplica una versión de respaldo con los mismos colores y la misma jerarquía.

> *Si alguien pregunta:* "¿y si no hay señal?" → esa es la respuesta.

### 1.2 El sprite de iconos SVG

```html
<svg hidden aria-hidden="true">
  <symbol id="i-pill" viewBox="0 0 24 24">
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
    <path d="m8.5 8.5 7 7"/>
  </symbol>
  ...
</svg>
```

Los 19 iconos se declaran **una sola vez** al inicio del documento y luego se
usan tantas veces como haga falta:

```html
<svg class="icono h-6 w-6" aria-hidden="true"><use href="#i-pill"></use></svg>
```

Ventajas frente a usar emojis o imágenes:

- **Un solo sitio que mantener.** Cambiar un icono lo cambia en toda la app.
- **Cero peticiones de red.** No se descarga ninguna imagen.
- **Heredan el color del texto** (`stroke: currentColor` en `style.css`), así que
  el mismo icono se ve verde, turquesa o ámbar según dónde esté.
- **Escalan sin pixelarse** en cualquier pantalla.
- `aria-hidden="true"` los oculta al lector de pantalla, porque son decorativos:
  el texto que va al lado ya dice lo mismo.

### 1.3 Los cinco bloques de la interfaz

```
<header>          → identidad + quién está usando la app
<main>
  1. Selector de entorno   → tres botones con data-contexto
  2. Resumen del día       → panel verde: saludo, pastilla, cita, hora
  3. Recordatorio          → tarjeta del medicamento + acciones
  4. Citas y avisos        → tarjetas con estado, generadas por JavaScript
  5. Mi información        → ficha de la persona, tratamiento e historial
</main>
<footer>
```

### 1.4 El detalle que conecta HTML y JS: `data-contexto`

```html
<button type="button" data-contexto="rural" aria-pressed="false" class="tarjeta-entorno">
```

Dos atributos hacen todo el trabajo:

- **`data-contexto`** es la llave que JavaScript usa para buscar el perfil
  correspondiente. El HTML no sabe *qué* dice el perfil rural; solo sabe que se
  llama `"rural"`. Los datos viven en `app.js`, la estructura en `index.html`.
- **`aria-pressed`** cumple **dos** funciones a la vez:
  1. Le anuncia al lector de pantalla cuál opción está activa.
  2. CSS lo usa como selector para pintar el estado seleccionado
     (`.tarjeta-entorno[aria-pressed="true"]`).

> **Esto es lo más elegante del código y conviene decirlo en voz alta:** el
> estado accesible y el estado visual son *el mismo dato*. Es imposible que se
> desincronicen, porque no hay dos fuentes de verdad.

### 1.5 Los contenedores vacíos

```html
<ol id="lista-pasos" class="mt-4 space-y-3"></ol>
<div id="lista-citas" class="mt-4 grid gap-4 sm:grid-cols-2"></div>
```

Están vacíos a propósito. JavaScript los rellena según el entorno elegido. El
HTML define **dónde** va el contenido; `app.js` define **cuál** es.

---

## 2. `app.js` — la lógica

Todo el archivo está envuelto en una **IIFE** (función que se ejecuta sola):

```js
(function () {
  "use strict";
  ...
})();
```

Así ninguna variable del proyecto queda suelta en `window`, y no puede chocar
con otro script. `"use strict"` obliga a declarar las variables y convierte en
error varios descuidos silenciosos de JavaScript.

El archivo tiene cinco bloques, en orden.

### 2.1 PERFILES — el corazón del proyecto

```js
var PERFILES = {
  rural: {
    persona: "Don José",
    saludo: "Buenas tardes, Don José",
    hora: "Al caer la tarde",
    detalle: "1 pastilla blanquita · con un vasito de agua",
    recordatorio: "Don José, ya se está entrando el sol. Acuérdese de tomar " +
                  "la pastilla blanquita para la presión con un vasito de agua.",
    pasos: [ ... ],
    citas: [ ... ],
    duda: [ ... ]
  },
  urbano: { ... },
  tradicional: { ... }
};
```

**Lo que hay que subrayar en la sustentación:** no es una traducción, ni un
cambio de sinónimos. Cambia **la manera de medir el tiempo**:

| | Rural | Urbano | Tradicional |
|---|---|---|---|
| Hora | "Ya se está entrando el sol" | "Van a ser las 6 de la tarde" | "Antes de que caiga el frío" |
| Medicamento | "la blanquita del frasco de tapa azul" | "la blanca redonda del empaque plateado" | "la blanquita del frasco de tapa azul" |
| Trato | Usted, Don José | Tú, Carmen | Usted, doña María |
| Cita | "Mañana, apenas salga el sol" | "Mañana a las 8:00 a. m." | "Mañana temprano, cuando aclare" |

El campo se rige por el sol; la ciudad, por el reloj. Ninguna de las dos formas
es más correcta que la otra: son dos maneras legítimas de saber qué hora es.

**Por qué los textos están en un objeto y no escritos dentro del HTML:**
para añadir un cuarto territorio solo hay que agregar una clave más a `PERFILES`
y un botón en el HTML. **No se toca ni una línea de lógica.** Esa es la prueba
de que la adaptación cultural es una decisión de *contenido*, no de programación.

### 2.2 DOM — las referencias

```js
function $(id) { return document.getElementById(id); }

var ui = {
  saludo: $("saludo"),
  texto: $("texto-recordatorio"),
  medEstado: $("med-estado"),
  ...
};
```

Se buscan los elementos **una sola vez** al cargar la página y se guardan en el
objeto `ui`. Si se buscaran cada vez que se usan, el navegador tendría que
recorrer el documento una y otra vez sin necesidad.

### 2.3 Pintado — de los datos a la pantalla

```js
function pintarPerfil(perfil) {
  pintarEncabezado(perfil);
  pintarResumen(perfil);

  ui.medDetalle.textContent = perfil.detalle;
  ui.medHoraTexto.textContent = perfil.hora;
  ui.texto.textContent = perfil.recordatorio;
  animar(ui.texto);

  pintarPasos(perfil.pasos);
  pintarCitas(perfil.citas);
  pintarAccionesDuda(perfil.duda);
  marcarPendiente();
}
```

Una función por cada zona de la pantalla. `pintarPerfil` es solo el director de
orquesta: no sabe *cómo* se dibuja una cita, solo sabe a quién pedírselo.

**La animación fluida**, que es lo que se ve al cambiar de entorno:

```js
function animar(elemento) {
  elemento.classList.remove("aparecer");
  void elemento.offsetWidth;   // fuerza un reflujo
  elemento.classList.add("aparecer");
}
```

Esa línea del medio parece inútil y es imprescindible. Leer `offsetWidth`
obliga al navegador a recalcular el diseño en ese instante, y así registra que
la clase se fue antes de volver. Sin ella, quitar y poner la clase en el mismo
ciclo no reinicia la animación y el efecto no se ve la segunda vez.

**`textContent` y no `innerHTML`:**

```js
art.querySelector("h3").textContent = cita.titulo;
```

`textContent` inserta el texto tal cual, sin interpretarlo como HTML. Si mañana
los textos vinieran de una base de datos o de un formulario, esto impediría una
inyección de código (XSS). Es una costumbre que conviene tener desde el primer
prototipo.

### 2.4 Acciones — lo que hace el usuario

```js
function seleccionarEntorno(clave) {
  var perfil = PERFILES[clave];
  if (!perfil) return;

  estado.entorno = clave;
  pintarPerfil(perfil);

  cerrarPasos();
  cerrarDuda();
  ui.bitacora.textContent = "";

  var botones = document.querySelectorAll("[data-contexto]");
  Array.prototype.forEach.call(botones, function (b) {
    b.setAttribute("aria-pressed", String(b.getAttribute("data-contexto") === clave));
  });
}
```

Un solo `setAttribute` marca el botón elegido y desmarca los otros dos, porque
la comparación devuelve `true` o `false` para cada uno. No hace falta recordar
cuál estaba activo antes.

**Los tres botones de acción:**

| Botón | Qué hace |
|---|---|
| ✅ **Ya me la tomé** | Estado → "Tomada", se deshabilita, aparece la felicitación, se añade el registro con la hora y se enciende el día de hoy en el historial |
| ❓ **Explicar de nuevo** | Despliega la misma indicación en cuatro pasos numerados; vuelve a pulsarse para ocultarla |
| ⚠️ **Tengo una duda** | Abre el panel de contacto con una persona del territorio |
| 📅 **Confirmar que va** | Marca la cita como confirmada |
| ✖️ **Ya no puedo ir** | Cancela una cita confirmada y la deja lista para volver a confirmar |

```js
function marcarTomada(perfil) {
  ui.medEstado.className = "chip-tomada";
  ui.medEstado.textContent = "Tomada";
  ui.resumenMedicamento.textContent = "Tomada";   // el panel verde también cambia
  ui.btnTomada.disabled = true;
  ...
}
```

Fíjese en la tercera línea: **una sola acción actualiza dos zonas de la pantalla
a la vez**. La tarjeta y el resumen del día no pueden contradecirse.

**Las citas tienen tres estados, y ninguno es definitivo:**

```js
function mostrar(situacion) {
  if (situacion === "confirmada") { ... }
  else if (situacion === "cancelada") { ... }
  else { /* pendiente */ }
}
```

Toda la apariencia de la tarjeta —el chip, el texto de los dos botones, cuál está
habilitado— la decide **una sola función**. Por eso es imposible que una tarjeta
quede en un estado a medias: no hay tres trozos de código pintando lo mismo.

Confirmar una cita nunca es una puerta de un solo sentido: si después la persona no
puede ir, lo dice desde la misma tarjeta. Es la misma idea del botón **Deshacer** del
registro de tomas, aplicada a las citas.

**El historial se calcula, no se escribe:**

```js
ui.resumenSemana.textContent =
  "Ha registrado " + tomadas + " de " + registradas + " tomas de esta semana.";
```

El texto sale de contar los puntos que están justo al lado. Si estuviera escrito a
mano, al confirmar la toma de hoy diría una cosa y los puntos mostrarían otra.

### 2.5 Arranque

```js
function iniciar() {
  var botones = document.querySelectorAll("[data-contexto]");
  Array.prototype.forEach.call(botones, function (b) {
    b.addEventListener("click", function () {
      seleccionarEntorno(b.getAttribute("data-contexto"));
    });
  });

  ui.btnExplicar.addEventListener("click", alternarExplicacion);
  ui.btnDuda.addEventListener("click", abrirDuda);
  ui.btnTomada.addEventListener("click", confirmarToma);

  seleccionarEntorno(ENTORNO_INICIAL);
}
```

Se conectan los eventos y se pinta el entorno inicial. La última línea es la
que hace que la aplicación nunca se vea vacía al abrirla.

---

## 3. Accesibilidad — decisiones concretas

Es el apartado que más puntos suele dar, porque son decisiones verificables.

| Decisión | Dónde está | Por qué |
|---|---|---|
| Botones de 68–76 px de alto | `min-h-[4.75rem]` | La norma WCAG 2.5.5 pide 44 px; se duplicó pensando en manos con temblor |
| La selección no depende del color | `aria-pressed` + marca ✓ | Una persona con daltonismo distingue igual cuál está activa |
| Contraste AA o superior | Toda la paleta | Texto `slate-900` sobre blanco; blanco sobre `emerald-600` |
| Foco visible de 3 px | `:focus-visible` en `style.css` | Quien navega con teclado siempre sabe dónde está |
| Enlace "saltar al contenido" | `.skip-link` | Evita recorrer el encabezado en cada pantalla |
| Se respeta `prefers-reduced-motion` | `@media` en `style.css` | Si el sistema pide menos animación, se desactiva |
| Todo registro se puede deshacer | Botón "Deshacer" | Ningún dato queda fijado sin que la persona pueda corregirlo |

---

## 4. Preguntas probables y cómo responderlas

**¿Por qué sin React o Angular?**
El usuario objetivo puede tener un teléfono de gama baja y conexión intermitente.
Un framework agregaría cientos de kilobytes para resolver un problema que aquí
no existe: la aplicación tiene una sola pantalla y un solo estado. Vanilla JS
carga al instante y funciona en cualquier navegador.

**¿Dónde se guardan los datos?**
En ningún lado. Todo vive en memoria y desaparece al recargar. Es una decisión
deliberada: no hay servidor, no hay `localStorage`, no hay analítica. Los datos
de salud son sensibles y este prototipo no necesita conservarlos.

**¿"Mi información" es una historia clínica?**
No, y la diferencia es deliberada. La aplicación muestra solo lo que sabe
legítimamente: los datos de afiliación, el tratamiento vigente, las tomas que la
persona confirmó y los controles que le tomaron. Una historia clínica completa
—diagnósticos, exámenes, evoluciones— son datos sensibles bajo la ley 1581 de
habeas data, exigen consentimiento expreso y le corresponden al prestador de salud.
Replicarlos en una app de recordatorios agranda el riesgo sin aportar nada al
problema que resuelve. Por eso la propia interfaz lo dice: *"su historia clínica
completa la guarda su prestador de salud, no esta aplicación"*.

El número de documento aparece enmascarado (`C.C. ••• ••• 432`) por la misma razón:
la persona necesita reconocer que es el suyo, no leerlo completo en pantalla.

**¿Cómo se añade un cuarto territorio?**
Una clave nueva en `PERFILES` y un botón con su `data-contexto` en el HTML.
Cero cambios en la lógica.

**¿Los textos son inventados? ¿Cómo sabe que así se habla?**
Los términos institucionales —vereda, EPS, fórmula médica, puesto de salud,
resguardo— son verificables. Las expresiones del habla cotidiana son plausibles
pero **no están validadas con hablantes**, y eso está documentado término por
término en `LEXICO.md`, con tres puntos marcados como pendientes.

Reconocerlo antes de que lo señalen es más fuerte que fingir certeza: en un
producto de verdad estos textos tendrían que **co-diseñarse con las comunidades**.
Un desarrollador imaginando cómo habla una vereda comete el mismo error que quiere
corregir.

**¿Y el perfil de Comunidad Tradicional?**
Es el punto más débil y conviene decirlo primero. En Colombia hay 115 pueblos
indígenas y más de 60 lenguas: no existe "una forma indígena de hablar". Por eso el
perfil se llama *Comunidad Tradicional* y no *Comunidad Indígena* — representa a una
persona mayor en zona rural donde la medicina tradicional sigue activa, que es lo
que los textos realmente dicen.

**¿Por qué "Tengo una duda" no responde la duda?**
Porque una aplicación no debe dar indicaciones médicas. El botón conecta con una
persona del territorio: el promotor de salud, el puesto de salud, el médico en su
próxima visita. La aplicación **recuerda**; decidir sobre el tratamiento le
corresponde a una persona.

---

## 5. Guion sugerido para la demostración en vivo

1. Abrir la aplicación. Está en **Rural / Campo**: leer el mensaje de Don José en voz alta.
2. Pulsar **Comunidad Tradicional**. Señalar que cambian el saludo, el avatar, la
   hora, el mensaje **y también las citas** — no solo una frase.
3. Pulsar **Urbano / Ciudad**. Señalar el cambio de *usted* a *tú* y del sol al reloj.
4. Pulsar **Explicar de nuevo**: la misma indicación, en cuatro pasos.
5. Pulsar **Ya me la tomé**: la tarjeta pasa a "Tomada", el panel verde de arriba
   también, y aparece el registro con la hora.
6. Bajar a **Mi información**: señalar el punto de hoy, que se acaba de poner verde,
   y el resumen que ya cuenta una toma más.
7. Pulsar **Deshacer** arriba: el punto vuelve a estar pendiente y el resumen baja.
8. En una cita, pulsar **Confirmar que va** y luego **Ya no puedo ir**. Cerrar con la
   frase: *"ningún dato queda registrado sin que la persona lo confirme, y todo lo que
   confirma lo puede corregir después"*.
