# Recordatorio de Salud

Aplicación de acompañamiento diario del tratamiento, con recordatorios que se
adaptan al entorno de cada persona.

## Cómo ejecutarla

1. Abrir esta carpeta en VS Code.
2. Clic derecho sobre `index.html` → **Open with Live Server**.
3. Requiere internet la primera vez: Tailwind CSS y la tipografía Inter se cargan
   por CDN. Si no hay conexión, se aplica un respaldo visual y la app sigue siendo
   usable.

> Si al recargar no ves un cambio de estilos, fuerza la recarga con `Ctrl + F5`:
> el navegador cachea `style.css`.

## Archivos

| Archivo                  | Responsabilidad                                                       |
|--------------------------|-----------------------------------------------------------------------|
| `index.html`             | Estructura semántica, sprite de iconos SVG y diseño en Tailwind.      |
| `style.css`              | Componentes con estado, animación, accesibilidad y respaldo offline.   |
| `app.js`                 | Perfiles por entorno, pintado de la interfaz y acciones del usuario.   |
| `PRESENTACION_CODIGO.md` | Explicación técnica del código, para proyectar y defender en clase.    |

## Interfaz

1. **Encabezado** — identidad y datos de la persona que usa la app.
2. **Selector de entorno** — Rural / Campo, Urbano / Ciudad y Comunidad Tradicional.
3. **Resumen del día** — saludo, estado de la pastilla, próxima cita y hora.
4. **Recordatorio** — tarjeta del medicamento, explicación paso a paso y panel de dudas.
5. **Citas y avisos** — próximas citas, también redactadas en el tiempo del entorno,
   con estado propio: por confirmar, confirmada o cancelada.
6. **Mi información** — datos de la persona, tratamiento vigente e historial reciente
   de tomas y controles de presión.

Cambiar de entorno reescribe toda la pantalla con una transición breve: saludo,
avatar, hora, mensaje, pasos, citas y acciones de contacto.

## Acciones

| Botón | Efecto |
|---|---|
| **Ya me la tomé** | Estado → "Tomada", se registra la hora y se actualiza el resumen del día. |
| **Explicar de nuevo** | Despliega la misma indicación en cuatro pasos numerados. |
| **Tengo una duda** | Abre las vías de contacto con una persona del entorno. |
| **Deshacer** | Revierte el registro y devuelve la pastilla a "Pendiente". |
| **Confirmar que va** | Marca la cita como confirmada. |
| **Ya no puedo ir** | Cancela una cita ya confirmada, sin tener que recargar nada. |

Confirmar la toma también enciende el día de hoy en el historial semanal, y deshacerla
lo apaga: el botón verde y el historial cuentan siempre lo mismo.

## Sistema de diseño

- **Paleta:** fondo `slate-100` con degradado `emerald-50`, superficies blancas
  y tres acentos con significado — `emerald` (rural y acción principal),
  `teal` (urbano) y `amber` (tradicional y avisos).
- **Formas:** `rounded-3xl`, bordes `emerald-100` de 1 px, sombras suaves.
- **Iconos:** sprite SVG de trazo (24×24, `stroke-width` 1.75) reutilizado con
  `<use href="#id">`.
- **Movimiento:** transiciones de 200 ms y animación de entrada al cambiar de
  entorno. Se respeta `prefers-reduced-motion`.

## Accesibilidad

- Áreas táctiles de 68–76 px en los botones de acción (WCAG 2.5.5 pide 44 px).
- La selección de entorno no depende del color: se marca con ✓ y con `aria-pressed`.
- Contraste AA o superior en todos los pares texto/fondo.
- Navegación completa por teclado, foco visible de 3 px y enlace "saltar al contenido".
- Todo registro puede deshacerse.

## Datos

Sin backend, sin `localStorage`, sin analítica. El registro vive en memoria y se
borra al recargar o al cambiar de entorno.

La sección **Mi información** muestra solo lo que la aplicación sabe legítimamente:
los datos de afiliación, el tratamiento vigente, las tomas que la persona confirmó y
los controles que le tomaron. La historia clínica completa es del prestador de salud
y no se replica aquí. El número de documento aparece enmascarado.
