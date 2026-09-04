/* =========================================================================
   Recordatorio de Salud
   Acompañamiento diario del tratamiento · Vanilla JS, sin dependencias.

   Bloques:
     1) PERFILES  -> el contenido adaptado a cada entorno
     2) DOM       -> referencias a la interfaz
     3) Pintado   -> cómo se dibuja un perfil en pantalla
     4) Acciones  -> confirmación, explicación, dudas y citas
     5) Arranque

   Toda la experiencia es visual: no hay audio, red, backend ni almacenamiento.

   Sobre los datos del medicamento: el nombre, la dosis y los rasgos físicos
   vendrían de la fórmula médica de cada persona. Aquí están escritos a mano
   como ejemplo de demostración.
   ========================================================================= */

(function () {
  "use strict";

  var ENTORNO_INICIAL = "rural";

  /* =======================================================================
     1) PERFILES · ADAPTACIÓN AL ENTORNO
     ---------------------------------------------------------------------
     No es una traducción: cambian la referencia temporal (el sol, el reloj,
     el amanecer), la forma de reconocer la pastilla, el trato personal y
     hasta cómo se anuncia una cita. Todo en lenguaje cotidiano, sin jerga.

     El nombre técnico del medicamento se muestra igual para los tres, en la
     ficha; lo que cambia es cómo se le nombra al hablarle a la persona.
     ======================================================================= */
  var PERFILES = {
    rural: {
      etiqueta: "Rural / Campo",
      lugar: "Vereda El Roble",
      persona: "Don José",
      iniciales: "DJ",
      avatar: "bg-emerald-100 text-emerald-700 ring-emerald-200",
      cajaMed: "bg-emerald-100 text-emerald-700",

      saludo: "Buenas tardes, Don José",
      resumen: "Hoy le toca una pastilla y tiene dos avisos pendientes.",

      /* Ficha del medicamento */
      medicamento: "Losartán de 50 miligramos",
      medicamentoPara: "Para la presión alta",
      aspecto: "Blanca y redonda, del frasco de tapa azul",
      cantidad: "Una sola pastilla",
      acompana: "Con un vasito de agua",

      hora: "Al caer la tarde",
      horaCorta: "Al caer el sol",
      recordatorio:
        "Don José, ya se está entrando el sol. Acuérdese de tomar la pastilla " +
        "blanquita de la presión, la del frasco de tapa azul, con un vasito de agua.",

      pasos: [
        "Busque el frasco de tapa azul, el de las pastillas blanquitas.",
        "Saque una sola pastilla, no más.",
        "Tómesela con un vasito de agua.",
        "Después toque el botón verde para dejarlo anotado."
      ],

      confirmacion: {
        titulo: "Muy bien hecho, Don José",
        detalle: "Ya quedó anotado. Siga cuidándose así."
      },

      citas: [
        {
          tipo: "cita",
          icono: "#i-calendar",
          titulo: "Control de la presión",
          cuando: "Mañana, apenas salga el sol",
          cortaCita: "Mañana al amanecer",
          lugar: "Puesto de salud de la vereda",
          con: "Con la enfermera Luz Marina",
          llevar: "Lleve el carné y el frasco de las pastillas",
          accion: "Confirmar que va",
          accionHecha: "Ya avisó que va",
          cancelar: "Ya no puedo ir",
          volver: "Volver a confirmar"
        },
        {
          tipo: "entrega",
          icono: "#i-package",
          titulo: "Entrega de las pastillas del mes",
          cuando: "El viernes, después del almuerzo",
          cortaCita: "El viernes",
          lugar: "Puesto de salud de la vereda",
          con: "Se las entrega el promotor de salud",
          llevar: "Lleve el carné y la fórmula",
          accion: "Ya las recogí",
          accionHecha: "Pastillas recogidas",
          cancelar: "Todavía no las recojo"
        }
      ],

      /* Ficha personal. En un producto real vendría del prestador de salud. */
      datosPersona: [
        ["Nombre completo", "José Antonio Ramírez"],
        ["Edad", "72 años"],
        ["Documento", "C.C. ••• ••• 432"],
        ["Afiliación", "Régimen subsidiado"],
        ["Dónde vive", "Vereda El Roble"],
        ["Quién lo acompaña", "Blanca, su hija"]
      ],

      datosTratamiento: [
        ["Para", "Presión alta"],
        ["Medicamento", "Losartán de 50 mg"],
        ["Cada cuánto", "Una pastilla al día"],
        ["Desde", "Hace 1 año y 7 meses"],
        ["Quién se lo mandó", "Médico del puesto de salud"],
        ["Alergias", "Ninguna registrada"]
      ],

      /* true = tomada · false = sin registro · null = el día de hoy */
      semana: [true, true, false, true, true, true, null],

      controles: [
        ["Hace 2 semanas", "138 / 85", "En el puesto de salud"],
        ["Hace 6 semanas", "142 / 88", "En el puesto de salud"],
        ["Hace 3 meses", "150 / 92", "Visita del promotor"]
      ],

      duda: [
        { icono: "#i-phone", texto: "Llamar al puesto de salud",
          respuesta: "Estamos comunicándolo con el puesto de salud de la vereda." },
        { icono: "#i-users", texto: "Avisarle al promotor de salud",
          respuesta: "Listo. El promotor de salud queda avisado y lo busca pronto." }
      ]
    },

    urbano: {
      etiqueta: "Urbano / Ciudad",
      lugar: "Barrio La Esperanza",
      persona: "Carmen",
      iniciales: "C",
      avatar: "bg-teal-100 text-teal-700 ring-teal-200",
      cajaMed: "bg-teal-100 text-teal-700",

      saludo: "Hola, Carmen",
      resumen: "Hoy te toca una pastilla y tienes dos avisos pendientes.",

      medicamento: "Losartán de 50 miligramos",
      medicamentoPara: "Para la presión alta",
      aspecto: "Blanca y redonda, en el empaque plateado",
      cantidad: "Una sola pastilla",
      acompana: "Con un vaso de agua, antes de la cena",

      hora: "Hoy a las 6:00 p. m.",
      horaCorta: "6:00 p. m.",
      recordatorio:
        "Hola Carmen, ya van a ser las 6 de la tarde. Es hora de tomar tu " +
        "pastilla de la presión, la blanca redonda del empaque plateado, antes de la cena.",

      pasos: [
        "Busca el empaque plateado de las pastillas de la presión.",
        "Saca una sola pastilla, la blanca redonda.",
        "Tómala con un vaso de agua, antes de la cena.",
        "Luego toca el botón verde para registrarlo."
      ],

      confirmacion: {
        titulo: "Excelente, Carmen",
        detalle: "Tu toma quedó registrada. Nos vemos en el próximo recordatorio."
      },

      citas: [
        {
          tipo: "cita",
          icono: "#i-calendar",
          titulo: "Control de la presión",
          cuando: "Mañana a las 8:00 a. m.",
          cortaCita: "Mañana, 8:00 a. m.",
          lugar: "Centro de salud · consultorio 3",
          con: "Con el médico general",
          llevar: "Lleva el documento y la fórmula médica",
          accion: "Confirmar la cita",
          accionHecha: "Cita confirmada",
          cancelar: "Ya no puedo ir",
          volver: "Volver a confirmar"
        },
        {
          tipo: "entrega",
          icono: "#i-package",
          titulo: "Reclamo de medicamentos",
          cuando: "El jueves a las 10:00 a. m.",
          cortaCita: "El jueves",
          lugar: "Farmacia de la EPS",
          con: "Entrega del mes completo",
          llevar: "Lleva el documento y la fórmula vigente",
          accion: "Ya los reclamé",
          accionHecha: "Medicamentos reclamados",
          cancelar: "Todavía no los reclamo"
        }
      ],

      datosPersona: [
        ["Nombre completo", "Carmen Elena Ospina"],
        ["Edad", "66 años"],
        ["Documento", "C.C. ••• ••• 187"],
        ["Afiliación", "Régimen contributivo"],
        ["Dónde vive", "Barrio La Esperanza"],
        ["Quién la acompaña", "Andrés, su hijo"]
      ],

      datosTratamiento: [
        ["Para", "Presión alta"],
        ["Medicamento", "Losartán de 50 mg"],
        ["Cada cuánto", "Una pastilla al día"],
        ["Desde", "Hace 2 años y 3 meses"],
        ["Quién se lo mandó", "Médico general del centro de salud"],
        ["Alergias", "Penicilina"]
      ],

      semana: [true, true, true, true, false, true, null],

      controles: [
        ["Hace 3 semanas", "132 / 84", "Centro de salud"],
        ["Hace 2 meses", "136 / 86", "Centro de salud"],
        ["Hace 4 meses", "145 / 90", "Centro de salud"]
      ],

      duda: [
        { icono: "#i-phone", texto: "Llamar a la línea de atención",
          respuesta: "Estamos comunicándote con la línea de atención de tu EPS." },
        { icono: "#i-calendar", texto: "Pedir cita con el médico",
          respuesta: "Listo. Tu solicitud de cita quedó enviada." }
      ]
    },

    tradicional: {
      etiqueta: "Comunidad Tradicional",
      lugar: "Casa comunal",
      persona: "Doña María",
      iniciales: "DM",
      avatar: "bg-amber-100 text-amber-700 ring-amber-200",
      cajaMed: "bg-amber-100 text-amber-700",

      saludo: "Buenas tardes, doña María",
      resumen: "Hoy le toca una pastilla y tiene dos avisos pendientes.",

      medicamento: "Losartán de 50 miligramos",
      medicamentoPara: "Para la presión alta",
      aspecto: "Blanca y redonda, del frasco de tapa azul",
      cantidad: "Una sola pastilla",
      acompana: "Con un poco de agua",

      hora: "Esta tarde, antes de que caiga el frío",
      horaCorta: "Antes del frío",
      recordatorio:
        "Buenas tardes, doña María. Es momento de tomar la pastilla de la presión, " +
        "la blanquita del frasco de tapa azul, acompañada de sus compresas de manzanilla.",

      pasos: [
        "Doña María, tenga a la mano el frasco de tapa azul.",
        "Saque una sola pastilla, la blanquita.",
        "Tómela con un poco de agua.",
        "Después puede poner sus compresas de manzanilla, como acostumbra.",
        "Cuando termine, toque el botón verde."
      ],

      confirmacion: {
        titulo: "Gracias, doña María",
        detalle: "Quedó anotado. Que siga bien acompañada en su cuidado."
      },

      citas: [
        {
          tipo: "cita",
          icono: "#i-calendar",
          titulo: "Control de la presión",
          cuando: "Mañana temprano, cuando aclare",
          cortaCita: "Mañana, al aclarar",
          lugar: "Casa comunal",
          con: "Vienen el médico y el promotor",
          llevar: "Puede acompañarla su familia",
          accion: "Confirmar que va",
          accionHecha: "Ya avisó que va",
          cancelar: "Ya no puedo ir",
          volver: "Volver a confirmar"
        },
        {
          tipo: "cita",
          icono: "#i-users",
          titulo: "Reunión de salud con los mayores",
          cuando: "El sábado, después del almuerzo",
          cortaCita: "El sábado",
          lugar: "Casa comunal",
          con: "Con los mayores de la comunidad",
          llevar: "No necesita llevar nada",
          accion: "Confirmar que va",
          accionHecha: "Ya avisó que va",
          cancelar: "Ya no puedo ir",
          volver: "Volver a confirmar"
        }
      ],

      datosPersona: [
        ["Nombre completo", "María Dolores Quintero"],
        ["Edad", "78 años"],
        ["Documento", "C.C. ••• ••• 905"],
        ["Afiliación", "Régimen subsidiado"],
        ["Dónde vive", "Cerca de la casa comunal"],
        ["Quién la acompaña", "Rosa, su nieta"]
      ],

      datosTratamiento: [
        ["Para", "Presión alta"],
        ["Medicamento", "Losartán de 50 mg"],
        ["Cada cuánto", "Una pastilla al día"],
        ["Desde", "Hace 11 meses"],
        ["Quién se lo mandó", "Médico de la brigada de salud"],
        ["Alergias", "Ninguna registrada"]
      ],

      semana: [true, false, true, true, true, false, null],

      controles: [
        ["Hace 1 mes", "145 / 88", "Visita a la casa comunal"],
        ["Hace 3 meses", "148 / 90", "Visita a la casa comunal"],
        ["Hace 6 meses", "152 / 94", "Brigada de salud"]
      ],

      duda: [
        { icono: "#i-users", texto: "Avisarle al promotor de la comunidad",
          respuesta: "Listo. El promotor de la comunidad queda avisado." },
        { icono: "#i-calendar", texto: "Dejar la duda para la visita médica",
          respuesta: "Su duda queda anotada para la próxima visita del médico." }
      ]
    }
  };

  /* =======================================================================
     2) DOM
     ======================================================================= */
  function $(id) { return document.getElementById(id); }

  var ui = {
    usuarioNombre: $("usuario-nombre"),
    usuarioLugar: $("usuario-lugar"),
    usuarioAvatar: $("usuario-avatar"),

    fechaHoy: $("fecha-hoy"),
    saludo: $("saludo"),
    resumenDia: $("resumen-dia"),
    resumenMedicamento: $("resumen-medicamento"),
    resumenCita: $("resumen-cita"),
    resumenHora: $("resumen-hora"),

    medIconoCaja: $("med-icono-caja"),
    medNombre: $("med-nombre"),
    medPara: $("med-para"),
    medHoraTexto: $("med-hora-texto"),
    medEstado: $("med-estado"),
    texto: $("texto-recordatorio"),

    fichaAspecto: $("ficha-aspecto"),
    fichaCantidad: $("ficha-cantidad"),
    fichaAcompana: $("ficha-acompana"),

    panelPasos: $("panel-pasos"),
    listaPasos: $("lista-pasos"),
    panelDuda: $("panel-duda"),
    accionesDuda: $("acciones-duda"),
    notaDuda: $("nota-duda"),

    btnTomada: $("btn-tomada"),
    etiquetaTomada: $("etiqueta-tomada"),
    btnExplicar: $("btn-explicar"),
    etiquetaExplicar: $("etiqueta-explicar"),
    btnDuda: $("btn-duda"),
    btnCerrarDuda: $("btn-cerrar-duda"),

    confirmacion: $("confirmacion"),
    confirmacionTitulo: $("confirmacion-titulo"),
    confirmacionDetalle: $("confirmacion-detalle"),

    bitacora: $("bitacora"),
    bitacoraVacia: $("bitacora-vacia"),
    listaCitas: $("lista-citas"),

    datosPersona: $("datos-persona"),
    datosTratamiento: $("datos-tratamiento"),
    semanaTomas: $("semana-tomas"),
    resumenSemana: $("resumen-semana"),
    listaControles: $("lista-controles"),

    panelResumen: $("panel-resumen")
  };

  var estado = { entorno: null };

  /* =======================================================================
     3) PINTADO
     ======================================================================= */

  /* Reinicia la animación de entrada: quitar la clase, forzar un reflujo y
     volver a ponerla. Sin el reflujo el navegador no reinicia el keyframe. */
  function animar(elemento) {
    if (!elemento) return;
    elemento.classList.remove("aparecer");
    void elemento.offsetWidth;
    elemento.classList.add("aparecer");
  }

  function pintarEncabezado(perfil) {
    ui.usuarioNombre.textContent = perfil.persona;
    ui.usuarioLugar.textContent = perfil.lugar;
    ui.usuarioAvatar.textContent = perfil.iniciales;
    ui.usuarioAvatar.className =
      "flex h-11 w-11 items-center justify-center rounded-full text-base font-extrabold ring-1 " +
      perfil.avatar;
  }

  function pintarResumen(perfil) {
    ui.fechaHoy.textContent = new Date().toLocaleDateString("es-CO", {
      weekday: "long", day: "numeric", month: "long"
    });

    ui.saludo.textContent = perfil.saludo;
    ui.resumenDia.textContent = perfil.resumen;
    ui.resumenCita.textContent = perfil.citas[0].cortaCita;
    ui.resumenHora.textContent = perfil.horaCorta;

    animar(ui.panelResumen);
  }

  function pintarPerfil(perfil) {
    pintarEncabezado(perfil);
    pintarResumen(perfil);

    ui.medIconoCaja.className = "caja-icono " + perfil.cajaMed;
    ui.medNombre.textContent = perfil.medicamento;
    ui.medPara.textContent = perfil.medicamentoPara;
    ui.medHoraTexto.textContent = perfil.hora;
    ui.texto.textContent = perfil.recordatorio;
    animar(ui.texto);

    ui.fichaAspecto.textContent = perfil.aspecto;
    ui.fichaCantidad.textContent = perfil.cantidad;
    ui.fichaAcompana.textContent = perfil.acompana;

    pintarPasos(perfil.pasos);
    pintarCitas(perfil.citas);
    pintarAccionesDuda(perfil.duda);
    pintarFicha(perfil);
    marcarPendiente();
  }

  function pintarPasos(pasos) {
    ui.listaPasos.textContent = "";

    pasos.forEach(function (texto, i) {
      var li = document.createElement("li");
      li.className = "flex items-start gap-3.5";

      var num = document.createElement("span");
      num.className =
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-teal-700 ring-1 ring-teal-200";
      num.textContent = String(i + 1);
      num.setAttribute("aria-hidden", "true");

      var cuerpo = document.createElement("span");
      cuerpo.className = "pt-1 text-[15px] font-medium leading-relaxed text-teal-900/85";
      cuerpo.textContent = texto;

      li.appendChild(num);
      li.appendChild(cuerpo);
      ui.listaPasos.appendChild(li);
    });
  }

  /* ---------- Citas ----------
     Tres estados posibles: por confirmar, confirmada y cancelada. Confirmar
     nunca es una puerta de un solo sentido: si la persona después no puede
     ir, lo dice desde la misma tarjeta. Es la misma idea del botón Deshacer
     del registro de tomas. */
  function pintarCitas(citas) {
    ui.listaCitas.textContent = "";

    citas.forEach(function (cita) {
      var esCita = cita.tipo === "cita";

      var art = document.createElement("article");
      art.className =
        "aparecer flex flex-col rounded-3xl border border-teal-100 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md";

      /* Cabecera: icono, título y estado */
      var cabecera = document.createElement("div");
      cabecera.className = "flex items-start justify-between gap-3";
      cabecera.innerHTML =
        '<div class="flex items-start gap-4">' +
          '<span class="caja-icono bg-teal-100 text-teal-700">' +
            '<svg class="icono h-6 w-6" aria-hidden="true"><use href="' + cita.icono + '"></use></svg>' +
          "</span>" +
          '<h3 class="pt-1 text-base font-bold leading-snug text-slate-900"></h3>' +
        "</div>" +
        '<span class="chip-por-confirmar shrink-0"></span>';
      cabecera.querySelector("h3").textContent = cita.titulo;

      var chip = cabecera.querySelector("span[class^='chip-']");

      /* Cuándo: el dato más importante, destacado */
      var cuando = document.createElement("p");
      cuando.className =
        "mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1.5 text-sm font-bold text-amber-700 ring-1 ring-amber-200";
      cuando.innerHTML =
        '<svg class="icono h-4 w-4" aria-hidden="true"><use href="#i-clock"></use></svg><span></span>';
      cuando.querySelector("span").textContent = cita.cuando;

      /* Detalles: dónde, con quién, qué llevar */
      var detalles = document.createElement("dl");
      detalles.className = "mt-5 space-y-2.5 text-[15px] font-medium text-slate-600";
      [
        ["#i-map-pin", cita.lugar],
        ["#i-users", cita.con],
        ["#i-clipboard", cita.llevar]
      ].forEach(function (par) {
        var fila = document.createElement("div");
        fila.className = "flex items-start gap-2.5";
        fila.innerHTML =
          '<svg class="icono mt-0.5 h-4 w-4 text-teal-600" aria-hidden="true"><use href="' + par[0] + '"></use></svg>' +
          "<span></span>";
        fila.querySelector("span").textContent = par[1];
        detalles.appendChild(fila);
      });

      /* Acción principal y acción de vuelta atrás */
      var principal = document.createElement("button");
      principal.type = "button";
      principal.className =
        "inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-2xl bg-teal-50 px-4 text-[15px] font-bold text-teal-800 ring-1 ring-teal-200 transition duration-200 hover:bg-teal-100";
      principal.innerHTML =
        '<svg class="icono h-5 w-5" aria-hidden="true"><use href="#i-check-circle"></use></svg><span></span>';

      var secundaria = document.createElement("button");
      secundaria.type = "button";
      secundaria.className =
        "mt-2.5 inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900";
      secundaria.innerHTML =
        '<svg class="icono h-4 w-4" aria-hidden="true"><use href="#i-x"></use></svg><span></span>';

      /* Un solo lugar decide cómo se ve cada estado. */
      function mostrar(situacion) {
        if (situacion === "confirmada") {
          chip.className = "chip-confirmada shrink-0";
          chip.textContent = esCita ? "Confirmada" : "Listo";
          principal.querySelector("span").textContent = cita.accionHecha;
          principal.disabled = true;
          principal.className = principal.className.replace(
            "bg-teal-50 text-teal-800 ring-teal-200 hover:bg-teal-100",
            "bg-emerald-50 text-emerald-700 ring-emerald-200"
          );
          secundaria.querySelector("span").textContent = cita.cancelar;
          secundaria.hidden = false;

        } else if (situacion === "cancelada") {
          chip.className = "chip-cancelada shrink-0";
          chip.textContent = "No puede ir";
          principal.querySelector("span").textContent = cita.volver || cita.accion;
          principal.disabled = false;
          secundaria.hidden = true;

        } else {
          chip.className = "chip-por-confirmar shrink-0";
          chip.textContent = esCita ? "Por confirmar" : "Pendiente";
          principal.querySelector("span").textContent = cita.accion;
          principal.disabled = false;
          secundaria.hidden = true;
        }
        animar(chip);
      }

      principal.addEventListener("click", function () { mostrar("confirmada"); });

      secundaria.addEventListener("click", function () {
        /* Una entrega no se "cancela": simplemente vuelve a quedar pendiente. */
        mostrar(esCita ? "cancelada" : "pendiente");
        principal.focus();
      });

      art.appendChild(cabecera);
      art.appendChild(cuando);
      art.appendChild(detalles);

      /* mt-auto empuja las acciones al pie: las tarjetas quedan parejas. */
      var pie = document.createElement("div");
      pie.className = "mt-auto flex flex-col pt-6";
      pie.appendChild(principal);
      pie.appendChild(secundaria);
      art.appendChild(pie);

      mostrar("pendiente");
      ui.listaCitas.appendChild(art);
    });
  }

  /* ---------- Mi información ----------
     La aplicación muestra solo lo que sabe legítimamente: los datos de la
     persona, su tratamiento vigente, lo que ella misma ha confirmado y lo que
     le tomaron en sus controles. La historia clínica vive en el prestador. */
  function pintarFicha(perfil) {
    pintarDatos(ui.datosPersona, perfil.datosPersona);
    pintarDatos(ui.datosTratamiento, perfil.datosTratamiento);
    pintarSemana(perfil.semana);
    pintarControles(perfil.controles);
  }

  function pintarDatos(contenedor, filas) {
    contenedor.textContent = "";

    filas.forEach(function (fila) {
      var bloque = document.createElement("div");
      bloque.className = "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1";

      var dt = document.createElement("dt");
      dt.className = "text-sm font-medium text-slate-500";
      dt.textContent = fila[0];

      var dd = document.createElement("dd");
      dd.className = "text-[15px] font-bold text-slate-900";
      dd.textContent = fila[1];

      bloque.appendChild(dt);
      bloque.appendChild(dd);
      contenedor.appendChild(bloque);
    });
  }

  var DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  /* Un punto por día. El estado se distingue por color, por icono y por texto
     oculto: nunca solo por el color. */
  function dibujarPunto(punto, tomada, dia) {
    var descripcion;

    if (tomada === null) {
      punto.className = "punto-toma punto-hoy";
      punto.innerHTML = '<svg class="icono h-4 w-4" aria-hidden="true"><use href="#i-clock"></use></svg>';
      descripcion = "hoy, pendiente";
    } else if (tomada) {
      punto.className = "punto-toma punto-si";
      punto.innerHTML = '<svg class="icono h-4 w-4" aria-hidden="true"><use href="#i-check"></use></svg>';
      descripcion = "tomada";
    } else {
      punto.className = "punto-toma punto-no";
      punto.innerHTML = '<svg class="icono h-4 w-4" aria-hidden="true"><use href="#i-minus"></use></svg>';
      descripcion = "sin registro";
    }

    var oculto = document.createElement("span");
    oculto.className = "sr-only";
    oculto.textContent = dia + ": " + descripcion;
    punto.appendChild(oculto);
  }

  function pintarSemana(semana) {
    ui.semanaTomas.textContent = "";

    semana.forEach(function (tomada, i) {
      var columna = document.createElement("div");
      columna.className = "flex flex-col items-center gap-2";

      var etiqueta = document.createElement("span");
      etiqueta.className = "text-xs font-bold text-slate-400";
      etiqueta.textContent = DIAS[i];

      var punto = document.createElement("span");
      dibujarPunto(punto, tomada, DIAS[i]);

      columna.appendChild(etiqueta);
      columna.appendChild(punto);
      ui.semanaTomas.appendChild(columna);
    });

    contarSemana(false);
  }

  /* El día de hoy es el último punto: se enciende cuando la persona confirma
     la toma, y se apaga si la deshace. El historial y el botón verde cuentan
     siempre la misma historia. */
  function marcarHoyEnSemana(tomada) {
    var columnas = ui.semanaTomas.children;
    if (!columnas.length) return;

    var punto = columnas[columnas.length - 1].querySelector(".punto-toma");
    dibujarPunto(punto, tomada ? true : null, DIAS[columnas.length - 1]);
    contarSemana(tomada);
  }

  /* El resumen se calcula a partir de los puntos, para que no pueda
     contradecir lo que se ve al lado. */
  function contarSemana(hoyTomada) {
    var perfil = perfilActual();
    if (!perfil) return;

    var tomadas = 0;
    var registradas = 0;

    perfil.semana.forEach(function (v) {
      if (v === null) return;
      registradas += 1;
      if (v) tomadas += 1;
    });

    if (hoyTomada) {
      tomadas += 1;
      registradas += 1;
    }

    ui.resumenSemana.textContent =
      "Ha registrado " + tomadas + " de " + registradas + " tomas de esta semana.";
  }

  function pintarControles(controles) {
    ui.listaControles.textContent = "";

    controles.forEach(function (control) {
      var li = document.createElement("li");
      li.className =
        "flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100";

      var izquierda = document.createElement("div");
      izquierda.innerHTML =
        '<span class="block text-[15px] font-bold text-slate-900"></span>' +
        '<span class="block text-xs font-medium text-slate-500"></span>';
      izquierda.querySelector("span:first-child").textContent = control[0];
      izquierda.querySelector("span:last-child").textContent = control[2];

      var valor = document.createElement("span");
      valor.className =
        "shrink-0 rounded-xl bg-white px-3 py-1.5 text-[15px] font-extrabold text-teal-800 ring-1 ring-teal-100";
      valor.textContent = control[1];

      li.appendChild(izquierda);
      li.appendChild(valor);
      ui.listaControles.appendChild(li);
    });
  }

  function pintarAccionesDuda(acciones) {
    ui.accionesDuda.textContent = "";

    acciones.forEach(function (accion) {
      var boton = document.createElement("button");
      boton.type = "button";
      boton.className =
        "inline-flex min-h-[3.5rem] items-center gap-3 rounded-2xl bg-white px-4 text-left text-[15px] font-bold text-amber-900 ring-1 ring-amber-200 transition duration-200 hover:bg-amber-100";
      boton.innerHTML =
        '<span class="caja-icono-sm bg-amber-100 text-amber-700">' +
          '<svg class="icono h-5 w-5" aria-hidden="true"><use href="' + accion.icono + '"></use></svg>' +
        "</span><span></span>";
      boton.querySelector("span:last-child").textContent = accion.texto;

      boton.addEventListener("click", function () {
        ui.notaDuda.textContent = accion.respuesta;
        ui.notaDuda.hidden = false;
        animar(ui.notaDuda);
      });

      ui.accionesDuda.appendChild(boton);
    });
  }

  /* ---------- Estados del medicamento ---------- */
  function marcarPendiente() {
    ui.medEstado.className = "chip-pendiente";
    ui.medEstado.textContent = "Pendiente";
    ui.resumenMedicamento.textContent = "Pendiente";

    ui.btnTomada.disabled = false;
    ui.etiquetaTomada.textContent = "Ya me la tomé";
    ui.confirmacion.hidden = true;

    marcarHoyEnSemana(false);
  }

  function marcarTomada(perfil) {
    ui.medEstado.className = "chip-tomada";
    ui.medEstado.textContent = "Tomada";
    ui.resumenMedicamento.textContent = "Tomada";

    ui.btnTomada.disabled = true;
    ui.etiquetaTomada.textContent = "Registrada";

    ui.confirmacionTitulo.textContent = perfil.confirmacion.titulo;
    ui.confirmacionDetalle.textContent = perfil.confirmacion.detalle;
    ui.confirmacion.hidden = false;
    animar(ui.confirmacion);

    marcarHoyEnSemana(true);
  }

  /* ---------- Registro del día, siempre reversible ---------- */
  function agregarRegistro() {
    var hora = new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

    var li = document.createElement("li");
    li.className =
      "aparecer flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm";

    var izquierda = document.createElement("div");
    izquierda.className = "flex items-center gap-3.5";
    izquierda.innerHTML =
      '<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">' +
        '<svg class="icono h-5 w-5" aria-hidden="true"><use href="#i-check"></use></svg></span>' +
      '<span><span class="block text-[15px] font-bold text-slate-900">Toma confirmada</span>' +
      '<span class="block text-sm font-medium text-slate-500">Hoy a las ' + hora + "</span></span>";

    var deshacer = document.createElement("button");
    deshacer.type = "button";
    deshacer.className =
      "shrink-0 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900";
    deshacer.textContent = "Deshacer";
    deshacer.setAttribute("aria-label", "Deshacer el registro de las " + hora);
    deshacer.addEventListener("click", function () {
      li.remove();
      actualizarEstadoVacio();
      marcarPendiente();
      ui.btnTomada.focus();
    });

    li.appendChild(izquierda);
    li.appendChild(deshacer);
    ui.bitacora.appendChild(li);
    actualizarEstadoVacio();
  }

  function actualizarEstadoVacio() {
    ui.bitacoraVacia.hidden = ui.bitacora.children.length > 0;
  }

  /* =======================================================================
     4) ACCIONES
     ======================================================================= */
  function seleccionarEntorno(clave) {
    var perfil = PERFILES[clave];
    if (!perfil) return;

    estado.entorno = clave;
    pintarPerfil(perfil);

    /* Cambiar de entorno es empezar de nuevo: se cierran paneles y registro. */
    cerrarPasos();
    cerrarDuda();
    ui.bitacora.textContent = "";
    actualizarEstadoVacio();

    var botones = document.querySelectorAll("[data-contexto]");
    Array.prototype.forEach.call(botones, function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-contexto") === clave));
    });
  }

  function perfilActual() {
    return PERFILES[estado.entorno];
  }

  function alternarExplicacion() {
    if (ui.panelPasos.hidden) {
      ui.panelPasos.hidden = false;
      animar(ui.panelPasos);
      ui.btnExplicar.setAttribute("aria-expanded", "true");
      ui.etiquetaExplicar.textContent = "Ocultar la explicación";
    } else {
      cerrarPasos();
    }
  }

  function cerrarPasos() {
    ui.panelPasos.hidden = true;
    ui.btnExplicar.setAttribute("aria-expanded", "false");
    ui.etiquetaExplicar.textContent = "Explicar de nuevo";
  }

  function abrirDuda() {
    ui.panelDuda.hidden = false;
    animar(ui.panelDuda);
    ui.btnDuda.setAttribute("aria-expanded", "true");
    ui.notaDuda.hidden = true;
    ui.btnCerrarDuda.focus();
  }

  function cerrarDuda() {
    ui.panelDuda.hidden = true;
    ui.btnDuda.setAttribute("aria-expanded", "false");
    ui.notaDuda.hidden = true;
  }

  function confirmarToma() {
    var perfil = perfilActual();
    if (!perfil) return;

    marcarTomada(perfil);
    agregarRegistro();
  }

  /* =======================================================================
     5) ARRANQUE
     ======================================================================= */
  function iniciar() {
    var botones = document.querySelectorAll("[data-contexto]");
    Array.prototype.forEach.call(botones, function (b) {
      b.addEventListener("click", function () {
        seleccionarEntorno(b.getAttribute("data-contexto"));
      });
    });

    ui.btnExplicar.addEventListener("click", alternarExplicacion);
    ui.btnDuda.addEventListener("click", abrirDuda);
    ui.btnCerrarDuda.addEventListener("click", function () {
      cerrarDuda();
      ui.btnDuda.focus();
    });
    ui.btnTomada.addEventListener("click", confirmarToma);

    seleccionarEntorno(ENTORNO_INICIAL);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
