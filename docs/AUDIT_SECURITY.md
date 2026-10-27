# 🔒 AUDITORÍA FORENSE: SEGURIDAD, SECRETOS Y HARDENING

**Fecha de ejecución:** 2026-10-18T22:36:00-03:00  
**Equipo auditor:** Auditor de Seguridad Senior / SRE  
**Objetivo:** Identificar vulnerabilidades, fugas de secretos, cabeceras faltantes, efectividad de protecciones contra bots (Honeypot, Turnstile) y exposición de datos PII.

---

## 1. RESUMEN DE POSTURA DE SEGURIDAD

| Dominio | Control Auditado | Estado | Severidad | Veredicto |
|---|---|---|---|---|
| **Secretos en Git** | Búsqueda por regex de claves y tokens | ✅ Limpio | Info | **CONFORME** (Sin tokens commiteados) |
| **Control de Entorno** | Exclusión de `.env` en `.gitignore` | ✅ Protegido | Info | **CONFORME** |
| **Cabeceras HTTP** | HSTS, X-Frame-Options, CSP, X-Content-Type | ⚠️ Parcial | **P2** | **FALTAN CABECERAS BÁSICAS** |
| **Fuga de Servidor** | Cabecera `x-powered-by: Express` | ⚠️ Expuesto | **P2** | **DEBE OCULTARSE** |
| **Protección Bot (Honeypot)** | Campo oculto `hp_field` | ✅ Implementado | Info | **FUNCIONAL** |
| **Protección Bot (Turnstile)** | Verificación server-side en Cloudflare | ❌ No implementado | **P1** | **GAP DE SEGURIDAD** |
| **Rate Limiting (Leads)** | Máx 5 peticiones/hora por IP hash | ✅ Implementado | Info | **FUNCIONAL** |
| **Privacidad PII (IP Hash)** | Hashing no reversible de IP cliente | ✅ Implementado | Info | **FUNCIONAL** |
| **Exposición RLS (Leads)** | Aislamiento de tabla `service_leads` | ✅ Blindado | Info | **CONFORME** |
| **Exposición RLS (Orders)** | Aislamiento de carritos anónimos | ❌ Fuga anónima | **P1** | **VULNERABILIDAD RLS** |

---

## 2. AUDITORÍA DE SECRETOS Y REPOSITORIO

### 2.1. Escaneo de Secretos Commiteados
Se ejecutó un análisis de patrones regex (`password|secret|api[_-]?key|token`) sobre el historial y working tree, excluyendo `dist/`, `node_modules/` y `.env.example`:
- **Resultado:** No se detectaron llaves privadas, tokens JWT con permisos de `service_role`, ni contraseñas de base de datos en el historial commiteado.
- Los archivos `ecosystem.config.cjs` y `ecosystem.config.js` leen las variables mediante `env_file: '.env'` o variables del entorno del sistema en runtime.

### 2.2. Verificación de `.gitignore`
El archivo `.gitignore` cubre estrictamente:
- `.env*` (a excepción de `.env.example`)
- `*.key`, `*.pem`
- `node_modules/`, `dist/`, `.angular/`, `coverage/`
- Clave de despliegue `ssh-key-2026-08-30.key` no está commiteada en el repo público.

---

## 3. AUDITORÍA DE CABECERAS HTTP EN PRODUCCIÓN (`https://arecofix.com.ar`)

Se ejecutó `curl -I https://arecofix.com.ar` contra el servidor en vivo:

### Cabeceras Detectadas:
```http
HTTP/1.1 200 OK
Date: Mon, 19 Oct 2026 01:33:18 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
Cache-Control: public, max-age=600, s-maxage=3600
content-security-policy: default-src 'self' ...
x-powered-by: Express
Server: cloudflare
```

### Análisis de Brechas:
1. **Ausencia de HSTS (`Strict-Transport-Security`):**  
   No se incluye la cabecera `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, dejando expuesta la conexión inicial a posibles ataques de degradación SSL (SSL Strip).
2. **Ausencia de `X-Frame-Options` o CSP `frame-ancestors`:**  
   La aplicación no bloquea explícitamente ser embebida en iframes externos maliciosos (riesgo de Clickjacking).
3. **Ausencia de `X-Content-Type-Options: nosniff`:**  
   Riesgo de MIME-sniffing en navegadores heredados.
4. **Fuga de fingerprinting:**  
   La cabecera `x-powered-by: Express` revela la tecnología del servidor de aplicaciones. Debe deshabilitarse con `app.disable('x-powered-by')` o `helmet()`.

---

## 4. AUDITORÍA DE CAPTURA DE LEADS Y ANTISPAM

### 4.1. Honeypot (Campo Trampa)
- **Implementación:** `src/app/features/services/application/usecases/create-lead.usecase.ts:28-31`
```typescript
if (dto.hp_field && dto.hp_field.trim().length > 0) {
  throw new Error('Bot detectado por trampa honeypot.');
}
```
- **Evaluación:** ✅ Si un bot automatizado completa todos los inputs visibles e invisibles del DOM, la solicitud es rechazada inmediatamente antes de interactuar con la base de datos.

### 4.2. Rate Limiting y Privacidad de IPs
- **Implementación:** `create-lead.usecase.ts:54-67`
- Genera un hash con algoritmo determinista `portableHash(clientIp + this.salt)`. La IP real del cliente nunca se almacena en texto plano en la tabla `service_leads` (cumple con GDPR/normativas de privacidad).
- Consulta `getRecentLeadCountByIp(ipHash, 1)` y si es `>= 5`, arroja `429 Too Many Requests`.
- **Evaluación:** ✅ Protección contra flood y saturación de base de datos.

### 4.3. Cloudflare Turnstile (GAP CRÍTICO)
- **Discrepancia Documental vs Código:**  
  La documentación (`CHANGELOG.md` y `.env.example`) declara que la API valida el token de Cloudflare Turnstile.
- **Realidad en Código:**  
  En `src/app/features/services/domain/dtos/service.dto.ts:81` se declaró el campo opcional `turnstile_token?: string;`. Sin embargo, en ningún archivo del servidor ni caso de uso existe una llamada HTTP hacia `https://challenges.cloudflare.com/turnstile/v0/siteverify` para validar dicho token con `TURNSTILE_SECRET`.
- **Impacto:** Si un bot elude el honeypot, puede enviar peticiones omitiendo el captcha o enviando un token falso sin ser rechazado.

---

## 5. PLAN DE ACCIÓN DE SEGURIDAD

1. **Implementar Validación Real de Turnstile (P1):**
   - Crear un guard o middleware en Express (`verifyTurnstileToken(secret, token, ip)`) que valide el token contra el endpoint oficial de Cloudflare antes de invocar `CreateLeadUseCase`.
2. **Corregir Política RLS de `orders` (P1):**
   - Reemplazar la política permisiva anónima para que solo admita lectura/modificación de carritos cuando coincida el header `x-guest-session`.
3. **Hardening de Cabeceras HTTP en Nginx / Express (P2):**
   - Configurar en `server.mjs`:
     ```javascript
     app.disable('x-powered-by');
     ```
   - O agregar en la configuración de Nginx:
     ```nginx
     add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
     add_header X-Frame-Options "SAMEORIGIN" always;
     add_header X-Content-Type-Options "nosniff" always;
     add_header Referrer-Policy "strict-origin-when-cross-origin" always;
     ```
