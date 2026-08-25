# Roadmap de curación — DMS (Dental Management System)

> Alcance de este documento: auditoría y planificación. No implementa cambios en la aplicación.

## Diagnóstico ejecutivo

El proyecto es **viable como caso de portfolio**, pero no está en condiciones de ser publicado ni usado con información clínica real. La base tecnológica (Next.js y React) permite una reconstrucción gradual, aunque los problemas de seguridad y de calidad no se resuelven con una actualización puntual de dependencias.

La estrategia recomendada es una **replataformización controlada**: conservar la intención funcional (sitio institucional, agenda, pacientes, tratamientos y notas), pero reemplazar los límites críticos —identidad, autorización, modelo de datos, validación, pruebas y diseño— antes de presentar el resultado.

Nombre del proyecto público: **DMS — Dental Management System**. Es un nombre descriptivo y genérico, apropiado para presentar una solución técnica en portfolio sin convertirla artificialmente en una marca de producto. La demostración se identificará como **DMS — Public Portfolio Demo** y el repositorio como `dms-portfolio-demo`.

## Narrativa de portfolio propuesta

La historia debe diferenciar con honestidad el encargo original de la demostración pública:

> **DMS — Dental Management System** is an independent public portfolio demo of a full-stack management system for a dental clinic. It builds on experience developing a solution for a real dental practice as part of a small team. The completed public demo will use a modern architecture and fictional data, while excluding private repository history, credentials, operational contact details, and visual assets from the original project.

Para LinkedIn o CV, una formulación honesta y concisa es:

> Developed a full-stack Dental Management System for a real dental practice as part of a small team. Independently created a public portfolio demo showcasing a modernized architecture, secure workflows, and fictional data.

No se debe describir como `freelance`, `production system` o software en uso por la clínica si el proyecto académico no tuvo esa modalidad o no se cuenta con evidencia. La narrativa anterior sigue siendo sólida ante clientes y reclutadores porque muestra entrega real, criterio técnico y una reconstrucción responsable.

## Pre-fase — Base pública saneada y primer commit

Esta fase ocurre **antes** de Fase 0 y antes de crear cualquier repositorio remoto público. Su fin no es modernizar funcionalidades: es producir una copia de trabajo apta para versionar sin arrastrar identidad, secretos ni historia de la clienta.

1. Crear una copia privada e inalterada del material de origen, fuera del futuro repositorio público. No se subirá ni se utilizará como base de despliegue.
2. Inventariar y clasificar cada archivo como: conservar como código genérico, reemplazar por demo ficticia, archivar en privado o eliminar del proyecto público.
3. Retirar del árbol público todos los secretos, scripts de inicialización inseguros, números, direcciones, nombres de la profesional, emails, documentación operativa y archivos no relacionados.
4. Retirar fotos clínicas, retratos, casos y cualquier identificador personal. Se incorporarán posteriormente recursos ficticios, sintéticos o con licencia documentada.
5. Sustituir identificadores heredados: nombre del paquete, título, favicon, metadatos, configuración y textos por placeholders de DMS; no se rediseña todavía la funcionalidad.
6. Añadir `.env.example`, `.gitignore` revisado, `README.md` mínimo, licencia elegida y un registro de saneamiento que no exponga el valor de los secretos retirados.
7. Inicializar Git únicamente después de verificar que no queden secretos, datos de pacientes ni activos de la profesional. El primer commit debe ser una fundación limpia y describible, por ejemplo: `chore: initialize privacy-safe DMS portfolio baseline`.

**Salida:** árbol local sin datos reales ni secretos, documentación mínima para arrancar y primer commit que se pueda publicar sin depender del repositorio original.

## Hallazgos de auditoría

### Bloqueantes de seguridad y privacidad (P0)

1. Hay una cadena de conexión de base de datos y credenciales iniciales incrustadas en `scripts/init-admin.js`. Deben considerarse comprometidas y revocarse fuera del repositorio antes de cualquier publicación.
2. La aplicación puede crear un administrador con una contraseña predecible durante el inicio de sesión. La política actual admite contraseñas de solo tres caracteres.
3. La cookie de sesión es un valor aleatorio que no se persiste ni se verifica. El middleware solo comprueba que exista una cookie, por lo que no constituye autenticación.
4. Los endpoints de pacientes, turnos, notas, tratamientos y configuración no aplican autenticación ni autorización. Exponen y permiten modificar o eliminar información clínica por HTTP directo.
5. El rate limiting vive en memoria y acepta cabeceras de IP sin una frontera de proxy confiable; no protege de forma consistente en despliegues con múltiples instancias.
6. Las rutas devuelven detalles internos en algunos errores y registran información identificable en consola.
7. `public/` contiene casos clínicos e imágenes potencialmente identificables, además de un archivo ajeno al producto. No hay evidencia de consentimiento, de anonimización ni de política de retención. Para portfolio se deben usar assets sintéticos, con licencia verificable o con autorización escrita y anonimización efectiva.

### Arquitectura y datos (P1)

1. La aplicación usa MongoDB/Mongoose y también el driver `mongodb`, aunque el dominio es relacional: pacientes, turnos, tratamientos y notas. La migración a PostgreSQL es adecuada y simplifica integridad referencial, migraciones y consultas.
2. Los modelos y las rutas de API duplican reglas; las entradas se aceptan en gran medida sin esquemas de validación ni tipos confiables. Existen varios usos de `any`.
3. Las páginas administrativas concentran lógica, fetches, estado y UI en archivos muy grandes (por ejemplo, agenda, pacientes y hero). Esto dificulta el mantenimiento y las pruebas.
4. La configuración de clínica no persiste y mezcla datos de ejemplo con la interfaz. La opción de cambiar email es únicamente visual.
5. El borrado de pacientes no protege las relaciones con turnos/notas ni define una política de archivado o auditoría.

### Calidad, entrega y dependencias (P1)

1. No hay tests, framework de pruebas, cobertura, CI ni documentación de arranque. Tampoco hay un repositorio Git en el directorio auditado.
2. TypeScript no opera en modo estricto y el build ignora errores de TypeScript y ESLint; esto oculta fallas de entrega.
3. En este entorno no estaba instalada la carpeta `node_modules`, por lo que no fue posible ejecutar lint ni type-check reales. El dry-run de instalación sí resolvió el lockfile.
4. `package-lock.json` incluye una cadena grande de herramientas de release no declaradas en `package.json`; el dry-run intenta instalar cientos de paquetes. El lockfile debe regenerarse desde un manifiesto intencional y mínimo.
5. La auditoría de dependencias reporta vulnerabilidades directas en Next.js y Mongoose, además de vulnerabilidades transitivas. No se debe aplicar una actualización ciega: hay que reconstruir el grafo, actualizar a versiones soportadas y volver a ejecutar el análisis.
6. Se incluyen MongoDB/Mongoose, Three.js, React Three Fiber, Drei y animaciones GSAP. Parte de esa complejidad sirve a una estética experimental, no al objetivo de una clínica profesional. Debe eliminarse si no hay una necesidad de producto demostrable.

### Producto, UX y presentación (P2)

1. El sitio mezcla datos reales/de ejemplo, nombres anteriores y textos que deben pasar una revisión editorial. La documentación operativa heredada expone datos de contacto históricos que no pertenecen al nuevo caso de portfolio.
2. La identidad visual coral, animaciones 3D y abundantes efectos no comunican con claridad una práctica odontológica confiable. El rediseño debe priorizar legibilidad, calma, jerarquía, agenda y conversión.
3. Hay imágenes con `<img>` sin optimización de Next, textos alternativos genéricos, idioma raíz en inglés y controles de carrusel sin etiquetas accesibles. No se contempla reducción de movimiento.
4. Faltan SEO y presentación de producción: metadatos correctos, Open Graph, sitemap, robots, datos estructurados, estados de carga/error consistentes y una política de contenido clínico.

## Decisiones de arquitectura propuestas

| Área | Decisión propuesta | Motivo |
| --- | --- | --- |
| Persistencia | PostgreSQL administrado + Prisma ORM y migraciones versionadas | El modelo es relacional y necesita restricciones, transacciones y trazabilidad. |
| Validación | Zod en límites HTTP/formularios, tipos inferidos | Una única fuente de verdad para datos de dominio. |
| Autenticación | Sesiones server-side verificables, cookie segura y roles mínimos | Evita que una cookie arbitraria habilite el área administrativa. |
| Formularios | React Hook Form + Zod | Mejor manejo de errores, accesibilidad y pruebas. |
| Pruebas | Vitest, Testing Library, Playwright y PostgreSQL efímero para integración | Cubre dominio, API y flujos reales de administración. |
| UI | Tailwind + componentes accesibles ya presentes; CSS/transiciones discretas | Mantiene una base conocida sin el peso visual/técnico de 3D. |
| Operación | Git, CI, preview deploys, checks obligatorios y observabilidad sin PII | Hace el proyecto demostrable y mantenible. |

`date-fns`, Radix y Lucide deben revisarse y actualizarse si siguen aportando valor. `mongodb`, `mongoose`, `@types/bcryptjs` y las dependencias 3D se retirarán tras la migración si no quedan usos legítimos. La selección final de versiones se hará sobre documentación oficial y auditoría limpia, no sobre rangos heredados.

## Plan por fases

### Fase 0 — Contención y saneamiento de material

- Revocar la conexión de base de datos y toda contraseña/token asociado desde sus proveedores; no basta con borrar el texto del proyecto.
- Inventariar repositorios remotos, historial, despliegues y variables de entorno para retirar los secretos de todos los lugares donde pudieron quedar expuestos.
- Eliminar datos de pacientes, imágenes clínicas, teléfonos, direcciones y referencias a la profesional anterior salvo autorización escrita, vigente y específica para portfolio.
- Retirar el archivo de presentación y cualquier activo no relacionado con el producto.
- Crear `.env.example` con variables ficticias y documentar el gestor de secretos elegido.

**Salida:** análisis de secretos sin resultados, assets con procedencia documentada y ningún dato real del cliente/paciente en el proyecto de portfolio.

### Fase 1 — Fundaciones reproducibles

- Inicializar un repositorio Git nuevo o reconectar el repositorio correcto; añadir licencia, README, guía de contribución, versión de Node y política de ramas.
- Simplificar `package.json`, regenerar el lockfile desde cero y fijar el gestor de paquetes y las versiones soportadas.
- Activar TypeScript estricto y hacer que `lint`, `typecheck`, `test` y `build` fallen ante errores.
- Incorporar Prettier, reglas de importación/arquitectura y hooks opcionales de pre-commit.
- Configurar CI para ejecutar los cuatro checks en cada pull request; habilitar Dependabot/Renovate y auditoría de dependencias.

**Salida:** clon limpio, instalación determinista, pipeline verde y ningún bypass de build.

### Fase 2 — Dominio PostgreSQL y migración segura

- Diseñar el esquema relacional: `users`, `patients`, `treatments`, `appointments`, `clinical_notes`, adjuntos y, si corresponde, `audit_events`.
- Definir claves foráneas, índices, unicidad, zonas horarias, estados de turno, soft-delete/archivo y reglas de borrado explícitas.
- Crear migraciones versionadas, seed exclusivamente ficticio y un plan de importación desechable para datos históricos si existieran y el cliente lo autorizara.
- Sustituir Mongoose/driver Mongo por el cliente PostgreSQL y una capa de repositorios/servicios pequeña y tipada.
- Validar todas las entradas, salidas y parámetros de ruta con Zod; normalizar errores de dominio.

**Salida:** entorno local y de prueba con PostgreSQL, migraciones reproducibles y sin dependencia de MongoDB.

### Fase 3 — Identidad, autorización y protección de datos

- Implementar autenticación con sesiones revocables verificadas en servidor, expiración, rotación y cookies `HttpOnly`, `Secure` y `SameSite` apropiadas.
- Exigir autorización en cada endpoint privado; separar rutas públicas de administración y aplicar roles mínimos.
- Reemplazar el bootstrap de administrador por un flujo de provisión seguro, con contraseñas robustas o invitación inicial de un solo uso.
- Usar rate limiting distribuido y una fuente de IP confiable de la plataforma de despliegue; añadir protección CSRF donde corresponda.
- Suprimir logs de PII, redactar errores y establecer retención, exportación y borrado de datos.
- Revisar headers/CSP para producción: una política única, sin permisos innecesarios y compatible con los recursos reales.

**Salida:** pruebas negativas demuestran que un visitante no puede leer ni alterar información clínica y una cookie inventada no da acceso.

### Fase 4 — Rediseño de producto y contenido de portfolio

- Redefinir la propuesta: sitio de una clínica ficticia y un backoffice de agenda, no una copia de la operación de una persona real.
- Crear un sistema visual sobrio: azul petróleo/verde suave y neutros, tipografía legible, espacios generosos, tarjetas funcionales, estados claros y CTA de agenda.
- Rediseñar la home alrededor de confianza, especialidades, profesionales, ubicación ficticia y canal de contacto simulado; evitar promesas médicas no verificables.
- Rehacer el admin como una experiencia operativa: tablero con próximas citas, agenda semanal, ficha de paciente, historial de notas y filtros, con componentes pequeños y reutilizables.
- Reemplazar animaciones 3D y GSAP por movimiento sutil, respetando `prefers-reduced-motion`; usar `next/image`, imágenes con licencia, alt útil y tamaños responsivos.
- Revisar español y regionalización, fijar `lang="es-AR"`, títulos, metadatos, Open Graph, sitemap, robots y datos estructurados de una organización ficticia.

**Salida:** interfaz responsive y accesible que se entiende sin animaciones ni datos reales, lista para screenshots y demo.

### Fase 5 — Pruebas y evidencia de calidad

- Unit tests para validaciones, servicios, cálculo/solapamiento de turnos y permisos.
- Integration tests contra PostgreSQL efímero para repositorios y rutas protegidas.
- E2E con Playwright: login, alta/edición/archivo de paciente, creación/reprogramación de turno, nota clínica y cierre de sesión.
- Pruebas de accesibilidad automatizadas en flujos críticos y revisión manual de teclado, foco, contraste y lector de pantalla.
- Añadir pruebas de regresión visual para las vistas principales y objetivos de cobertura acordados por capas, no una métrica global vacía.

**Salida:** pipeline verde con pruebas significativas y evidencia repetible de los flujos de portfolio.

### Fase 6 — Entrega y narrativa profesional

- Desplegar preview y producción con entornos aislados, PostgreSQL administrado, backups, alertas de error y variables de entorno gestionadas.
- Documentar arquitectura, modelo de datos, decisiones de seguridad, guía local, comandos y límites conocidos.
- Preparar datos demo, un usuario demo de vida corta o walkthrough grabado; nunca publicar credenciales permanentes.
- Publicar una case study honesta: contexto académico convertido en reconstrucción profesional, problema, decisiones, alcance, stack, pruebas, resultados y aprendizajes. No afirmar que fue software utilizado en producción para una clienta si no lo fue.

**Salida:** repositorio, demo y case study consistentes entre sí, sin secretos ni información personal, aptos para entrevista técnica y portfolio.

## Orden obligatorio de ejecución

`Pre-fase → Fase 0 → Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5 → Fase 6`

No se debe diseñar sobre datos reales, migrar datos ni publicar un preview antes de cerrar la Fase 0. Tampoco se debe abrir el admin o conectar una base de producción antes de completar la Fase 3.

## Alcance intencional del primer relanzamiento

Incluye: sitio institucional ficticio, agenda interna, pacientes de demostración, tratamientos, notas clínicas demo, autenticación administrativa, auditoría mínima y despliegue demostrable.

Queda fuera hasta una evaluación posterior: pagos, facturación, mensajería automática, carga de archivos clínicos reales, múltiples sucursales, múltiples profesionales, integraciones de mensajería y cumplimiento regulatorio como sistema clínico productivo.

## Riesgos y decisiones pendientes

1. **Consentimiento y autoría:** confirmar por escrito si alguna imagen, texto o identidad del proyecto original puede reutilizarse. Sin esa confirmación, se reemplaza todo.
2. **Objetivo de portfolio:** decidir si se muestra solo el sitio público o también el backoffice. Mostrar datos clínicos ficticios es posible; mostrar datos reales no.
3. **Despliegue:** elegir proveedor, región y política de backups después de definir si el proyecto será solo demo o una aplicación real.
4. **Identidad pública:** mantener DMS como nombre descriptivo; solo evaluar una marca propia si en el futuro se decide comercializar el proyecto.

## Evidencia de la auditoría

- 57 archivos TypeScript/TSX; varias pantallas concentran cientos de líneas de UI y lógica.
- No se encontró configuración de tests ni scripts de `test`/`typecheck`.
- El entorno auditado no tenía dependencias instaladas; por ello lint y type-check no pudieron ejecutarse. La instalación en modo dry-run sí resolvió el lockfile.
- El análisis de dependencias detectó vulnerabilidades, incluidas directas en el framework y la capa MongoDB. Será necesario repetirlo tras reconstruir el manifiesto y el lockfile.
- Este roadmap no contiene ni reproduce los secretos hallados.
