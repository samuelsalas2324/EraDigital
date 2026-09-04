# Revisión del léxico por entorno

Documento de trabajo sobre las expresiones usadas en `app.js`, entorno por entorno.

---

## Antes que nada: qué significa aquí "corroborado"

Conviene ser exacto, porque de esto depende qué se puede afirmar en la sustentación.

**Lo que sí se hizo:** una revisión con criterio lingüístico del español colombiano.
Cada término se clasificó según qué tan defendible es, y se corrigieron los que
no resistían el examen.

**Lo que NO se hizo, y no se puede simular:** validar las expresiones con hablantes
reales de cada territorio, ni contrastarlas contra un corpus dialectal. Eso exige
trabajo de campo o, como mínimo, consultar el *Atlas Lingüístico-Etnográfico de
Colombia* (ALEC) del Instituto Caro y Cuervo.

Por eso ninguna expresión aparece marcada como "verificada". La escala es:

| Marca | Qué significa |
|---|---|
| 🟢 **Institucional** | Término oficial del sistema de salud o del ordenamiento territorial colombiano. Comprobable en documentación pública. |
| 🟡 **Plausible** | Uso extendido y coherente con el habla de la zona, pero no contrastado con fuentes ni hablantes. |
| 🔴 **Por validar** | Punto débil identificado. Requiere decisión o consulta antes de defenderlo. |

> **Si en la sustentación le preguntan "¿cómo sabe que así se habla?"**, la respuesta
> honesta —y la más fuerte— es: *"no lo sé con certeza, y por eso está documentado
> como pendiente de validación con la comunidad. Un desarrollador imaginando cómo
> habla una vereda comete el mismo error que el proyecto quiere corregir."*

---

## Entorno Rural / Campo

| Expresión | Marca | Nota |
|---|---|---|
| **vereda** | 🟢 | Unidad territorial rural reconocida en la división político-administrativa colombiana. |
| **puesto de salud** | 🟢 | Denominación del primer nivel de atención en zonas rurales. |
| **carné** | 🟢 | Así se nombra en Colombia el documento de afiliación (no "tarjeta sanitaria" ni "cartilla"). |
| **fórmula** | 🟢 | En Colombia la prescripción es la *fórmula médica*, no la "receta". |
| **promotor de salud** | 🟡 | Figura real de atención comunitaria rural. La denominación oficial ha variado según la época y la región (*auxiliar de salud pública*, *gestor comunitario*). Se mantiene "promotor" porque es como la nombra la gente. |
| **"ya se está entrando el sol"** | 🟡 | *Entrarse el sol* por *ponerse el sol* es una construcción del habla campesina andina. Es la expresión más característica del perfil y también la que más convendría validar. |
| **"la pastilla blanquita"**, **"un vasito de agua"** | 🟡 | El diminutivo afectivo (`-ito`, `-ita`) es un rasgo muy marcado del español colombiano, y aquí cumple una función real: identifica el medicamento por su aspecto. |
| **"Acuérdese de…"** (usted) | 🟡 | El *usted* como trato por defecto, incluso en la cercanía, es característico del interior de Colombia. Coherente con el personaje. |

### Corregido en esta revisión

**"Tienda de la vereda" como punto de entrega de medicamentos** 🔴 → **corregido**.
La entrega de medicamentos por fuera de un prestador autorizado no es un canal
formal del sistema de salud colombiano. Aunque de manera informal existan puntos
de acopio comunitarios, ponerlo en la interfaz debilitaba la verosimilitud de toda
la aplicación. Ahora la entrega ocurre en el **puesto de salud de la vereda**, a
cargo del **promotor de salud**.

---

## Entorno Urbano / Ciudad

| Expresión | Marca | Nota |
|---|---|---|
| **EPS** | 🟢 | Entidad Promotora de Salud. Término universal en Colombia. |
| **fórmula médica**, **fórmula vigente** | 🟢 | Correcto. La vigencia de la fórmula es un requisito real para reclamar. |
| **"reclamar los medicamentos"** | 🟢 | *Reclamar* es el verbo que efectivamente se usa en Colombia, no "recoger" ni "retirar". |
| **centro de salud · consultorio 3** | 🟢 | Nomenclatura habitual. |
| **"el empaque plateado"** | 🟡 | Sustituye a *blíster*, que era un tecnicismo. En el habla común también se dice *la lámina* o *el paquetico*. "Empaque" es la opción más neutra y comprensible. |

### Punto pendiente de decisión

**El tuteo a Carmen** 🔴

El perfil urbano tutea (*"tu pastilla"*, *"toca el botón"*). Eso funciona como
contraste pedagógico frente al *usted* del campo, pero tiene un costo: en Bogotá y
buena parte del interior colombiano predomina el **usted** incluso en el trato
cercano, y tutear a una mujer adulta mayor puede sonar impropio. El tuteo ata
implícitamente a Carmen a la costa Caribe o a ciertos contextos juveniles urbanos.

**Tres salidas posibles**, en orden de solidez:

1. **Cambiar el perfil urbano a *usted*.** El contraste seguiría existiendo —el
   reloj frente al sol, el empaque frente al frasco— y desaparece el riesgo.
2. **Declarar la ciudad.** Si Carmen vive en Barranquilla, el tuteo es correcto y
   deja de ser un descuido para volverse una decisión.
3. **Dejarlo y reconocerlo** como una simplificación del prototipo.

No se cambió por cuenta propia porque el contraste *usted / tú* es una decisión de
diseño del proyecto, no un error de programación.

---

## Comunidad Tradicional

| Expresión | Marca | Nota |
|---|---|---|
| **resguardo** | 🟢 | Figura territorial legal de los pueblos indígenas en Colombia. |
| **"los mayores"** | 🟡 | Tratamiento respetuoso hacia las personas de más edad, de uso extendido en comunidades indígenas y campesinas colombianas. |
| **casa comunal** | 🟡 | Existe, pero el nombre del espacio de reunión cambia según el pueblo: *maloca* (Amazonía), *casa del cabildo*, *kankurwa* (arhuaco). "Casa comunal" es el término genérico. |
| **compresas de manzanilla** | 🟡 | La manzanilla es de origen europeo, adoptada hace siglos en la medicina popular andina. Se usa en compresa —aplicación externa— y por eso no interfiere con la pastilla. |

### El punto más importante de todo el documento

**El perfil no tiene marca lingüística propia** 🔴

Los textos de este entorno son español cortés estándar. Lo único que lo distingue
del perfil rural es la mención a las compresas. Y ahí hay un problema de fondo:

> En Colombia hay **115 pueblos indígenas y más de 60 lenguas nativas**. No existe
> una "forma indígena de hablar". Un perfil único que los represente a todos es
> exactamente el estereotipo que este proyecto dice combatir.

**Dos caminos honestos:**

- **Nombrar un pueblo concreto** —nasa, wayuu, misak, arhuaco— y construir ese
  perfil con hablantes de esa comunidad. Es la única versión defendible de la idea
  original, y no se puede hacer desde un escritorio.
- **Asumir lo que el perfil realmente representa hoy**: una persona mayor en zona
  rural donde la medicina tradicional sigue activa y convive con el tratamiento
  formal. Eso es lo que los textos dicen de verdad, y es sostenible.

El perfil ya se llama **"Comunidad Tradicional"** y no "Comunidad Indígena", lo cual
corresponde al segundo camino. Conviene decirlo explícitamente en la sustentación
en vez de esperar a que lo señalen.

---

## Sobre los datos del medicamento

**Losartán de 50 mg** es un antihipertensivo de uso extendido, y la dosis es una de
las presentaciones comerciales habituales. Está escrito a mano como ejemplo: en un
producto real, el nombre, la dosis y los rasgos físicos vendrían **de la fórmula
médica de cada persona**, cargados por el prestador. La aplicación no decide nada
sobre el tratamiento.

Los rasgos de identificación —*"blanca y redonda"*, *"del frasco de tapa azul"*,
*"del empaque plateado"*— responden a un problema real: hay muchas pastillas blancas
y redondas. Por eso la ficha combina **tres señas** (color, forma y envase) en lugar
de una sola, y el mensaje repite la que la persona reconoce más rápido.

---

## Cómo se validaría de verdad

Un protocolo mínimo, por si conviene proponerlo como trabajo futuro:

1. **Fuente documental.** Contrastar las expresiones temporales contra el *Atlas
   Lingüístico-Etnográfico de Colombia* (ALEC) del Instituto Caro y Cuervo.
2. **Consulta con hablantes.** Cinco a ocho personas mayores por territorio, con una
   pregunta abierta —*"¿cómo le diría usted a alguien que ya es hora de la pastilla?"*—
   antes de mostrarles ninguna propuesta, para no inducir la respuesta.
3. **Validación con quien acompaña.** Promotores de salud y personal de enfermería
   del territorio revisan que la instrucción sea correcta además de comprensible.

El orden importa: primero se escucha, después se escribe. Al revés se obtiene lo que
hay ahora — texto plausible, escrito por quien no vive allí.
