# Registro de Deuda de Seguridad Técnica

Este documento registra formalmente decisiones operativas y excepciones temporales de seguridad en la infraestructura y código del proyecto Arecofix.

---

## SEC-DEBT-001: Credenciales de Google OAuth Client en Repositorio Git

* **Identificador**: SEC-DEBT-001
* **Fecha de Registro**: 2026-11-04
* **Severidad**: Media / Operativa
* **Origen**: Commit `4761d7e3aca617538142f498bf39ca57f627250a` (rechazado por GitHub Push Protection en pre-receive).
* **Descripción del Hallazgo**: Se detectó la inclusión de un Google OAuth Client ID y Google OAuth Client Secret en formato plano dentro de `docker-compose.yml`.
* **Acción de Remediación Ejecutada**:
  * Removido de la historia local de Git mediante `git filter-repo` antes de ingresar al repositorio remoto (`origin/main`).
  * Reemplazado en `docker-compose.yml` por variables de entorno obligatorias con sintaxis de fallo rápido (`${GOOGLE_OAUTH_CLIENT_ID:?...}` y `${GOOGLE_OAUTH_CLIENT_SECRET:?...}`).
  * Valores reales alojados en archivo `.env` no versionado e ignorado en `.gitignore`.
* **Decisión del Usuario / Riesgo Aceptado**:
  * Las credenciales **no fueron rotadas en Google Cloud Console** por decisión operativa del usuario.
  * *Riesgo residual*: Si la rama local o el commit hubiesen sido respaldados o clonados en entornos de terceros antes del rewrite, el secreto podría haber quedado expuesto.
* **Acción Futura Requerida**:
  * Rotar el secreto del cliente OAuth en la consola de Google Cloud Platform y actualizar la variable `GOOGLE_OAUTH_CLIENT_SECRET` en el archivo `.env` del servidor.

---

## SEC-DEBT-002: Contraseñas y Secretos JWT en Configuración Compose

* **Identificador**: SEC-DEBT-002
* **Fecha de Registro**: 2026-11-04
* **Severidad**: Media
* **Descripción**: Históricamente `docker-compose.yml` contenía valores predeterminados para `POSTGRES_PASSWORD` y `JWT_SECRET`.
* **Acción de Remediación Ejecutada**:
  * Eliminados todos los valores por defecto. Se exige obligatoriamente su definición en `.env` mediante la sintaxis `:?variable is required`.
* **Acción Futura Requerida**:
  * En una ventana de mantenimiento programada, rotar la contraseña del motor PostgreSQL (`postgres`) y actualizar la cadena de conexión en los contenedores de Supabase.
