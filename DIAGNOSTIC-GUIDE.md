# 🔍 Guía de Diagnóstico - Acceso a Sucursales

## 📋 Pasos para Diagnosticar el Problema

### Paso 1: Verificar Rol en Base de Datos
Ejecuta este SQL en Supabase para verificar tu rol actual:

```sql
-- Copia y pega el contenido de check-user-role.sql
```

**Busca estos resultados:**
- ✅ `role: 'admin'` o `'super_admin'`
- ✅ `email: 'ezequielenrico15@gmail.com'`
- ✅ `access_level: 'Admin - Acceso global'`

### Paso 2: Probar Acceso con Logging Detallado

1. **Abre la consola del navegador** (F12)
2. **Limpia la consola** (ícono de basura)
3. **Inicia sesión** como `ezequielenrico15@gmail.com`
4. **Intenta acceder a una sucursal** (click en tarjeta o URL directa)

**Deberías ver estos mensajes:**

```
🔍 authGuard - Checking access for: /admin
📋 authGuard - User profile: {email: "ezequielenrico15@gmail.com", role: "admin", ...}
🔓 Auth access granted for user: ezequielenrico15@gmail.com role: admin

🔍 branchAdminGuard - Checking access for: /lubreze/admin
👤 User ID: [UUID]
📋 User profile: {email: "ezequielenrico15@gmail.com", role: "admin", ...}
🔓 Super Admin access granted for branch: lubreze
```

### Paso 3: Identificar el Problema

**Si NO ves los mensajes de los guards:**
- El guard no se está ejecutando
- Puede haber un problema de caché
- Recarga con Ctrl+F5

**Si ves mensajes de acceso denegado:**
```
🚫 Auth access denied for user: ezequielenrico15@gmail.com role: user
```
- Tu rol en la base de datos no es correcto
- Ejecuta el SQL del Paso 1

**Si ves errores:**
```
❌ Error in branchAdminGuard: [error details]
```
- Hay un problema técnico que necesitamos revisar

### Paso 4: Soluciones Comunes

#### Opción A: Rol Incorrecto
Si tu rol no es 'admin' o 'super_admin':

```sql
-- Actualizar tu rol a admin
UPDATE public.profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'ezequielenrico15@gmail.com';
```

#### Opción B: Problema de Caché
1. Cierra completamente el navegador
2. Limpia caché y cookies
3. Vuelve a iniciar sesión

#### Opción C: Problema de Ruta
Verifica que la URL sea correcta:
- ✅ `/lubreze/admin`
- ✅ `/central/admin`
- ❌ `/admin` (solo dashboard principal)

### Paso 5: Verificación Final

**Acceso que debería funcionar:**
1. `/admin` → Dashboard Super Admin ✅
2. Click en "Lubreze" → `/lubreze/admin` ✅
3. Click en "Central" → `/central/admin` ✅
4. URL directa: `/nombre-sucursal/admin` ✅

**Lo que deberías ver en cada sucursal:**
- Panel de administración completo
- Productos de esa sucursal
- Órdenes de esa sucursal
- Clientes de esa sucursal

## 🚨 Si Nada Funciona

**Ejecuta este diagnóstico completo:**

1. **Verifica sesión actual:**
   ```javascript
   // En consola del navegador
   localStorage.getItem('supabase.auth.token')
   ```

2. **Verifica AuthService:**
   ```javascript
   // En consola del navegador (si tienes acceso a Angular)
   // No aplicable directamente, pero los logs nos ayudarán
   ```

3. **Reporta exactamente lo que ves:**
   - Mensajes de la consola (completos)
   - URL a la que intentas acceder
   - Comportamiento (redirección, error, etc.)
   - Resultado del SQL del Paso 1

## 📞 Información a Proporcionar

Si necesitas ayuda, proporciona:

1. **Resultado del SQL** (Paso 1)
2. **Logs completos de la consola** (Paso 2)
3. **URL exacta** que intentas acceder
4. **Comportamiento observado**

---

## ✅ Checklist de Diagnóstico

- [ ] Rol verificado en base de datos
- [ ] Logs de guards visibles en consola
- [ ] Mensajes de acceso concedido
- [ ] Acceso a /admin funciona
- [ ] Acceso a sucursales funciona
- [ ] Sin redirecciones al login

**Una vez que completes estos pasos, podremos identificar y solucionar el problema definitivamente.** 🔧
