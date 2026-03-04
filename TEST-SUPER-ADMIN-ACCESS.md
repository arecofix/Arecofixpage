# 🧪 Guía de Prueba - Acceso Super Admin a Sucursales

## 🎯 Objetivo
Verificar que el Super Admin (`ezequielenrico15@gmail.com`) pueda acceder a cualquier sucursal sin ser redirigido al login.

## 🔧 Cambios Realizados

### 1. branchAdminGuard Actualizado
- ✅ Reconoce `authService.isSuperAdmin()`
- ✅ Reconoce email `ezequielenrico15@gmail.com`
- ✅ Reconoce roles: `super_admin`, `admin`, `tenant_owner`
- ✅ Logging detallado para debugging

### 2. authGuard Mejorado
- ✅ Reconoce `authService.isSuperAdmin()`
- ✅ Reconoce email `ezequielenrico15@gmail.com`
- ✅ Logging de acceso/denegado
- ✅ Mejor manejo de errores

## 🚀 Pasos de Prueba

### Paso 1: Acceso a Admin Central
1. Iniciar sesión como `ezequielenrico15@gmail.com`
2. Ir a `/admin`
3. ✅ Deberías ver el dashboard principal con badges de Super Admin

### Paso 2: Acceso a Sucursales
1. Desde el dashboard, hacer click en cualquier tarjeta de sucursal
2. O navegar directamente a `/nombre-sucursal/admin`
3. ✅ Deberías acceder sin redirección al login

### Paso 3: Verificar en Consola
Abre la consola del navegador y busca estos mensajes:

**Acceso permitido:**
```
🔓 Super Admin access granted for branch: nombre-sucursal
🔓 Auth access granted for user: ezequielenrico15@gmail.com role: admin
```

**Si hay problemas:**
```
⚠️ No branch slug found in route for staff user
🚫 Access denied for user: ezequielenrico15@gmail.com role: admin
```

## 🐛 Troubleshooting

### Si todavía te redirige al login:

1. **Verifica que estés logueado:**
   ```javascript
   // En consola del navegador
   localStorage.getItem('supabase.auth.token')
   ```

2. **Limpia caché y recarga:**
   - Ctrl+F5 (Windows) o Cmd+Shift+R (Mac)
   - O limpia datos del sitio

3. **Verifica el perfil del usuario:**
   - Ve a `/admin/dashboard`
   - Deberías ver "Super Admin" badge

### Si ves errores en consola:

**Error常见:**
```
Selected branch for management: 15976671-9cec-4a3d-a31d-5f74d7643b37
```
- ✅ Esto es normal, significa que se seleccionó la sucursal

**Facebook/Analytics errors:**
- ✅ Estos son errores de terceros, no afectan la funcionalidad

## 📊 Flujo Esperado

```
1. Login ✅
2. /admin ✅ (Dashboard Super Admin)
3. Click sucursal "Lubreze" ✅
4. /lubreze/admin ✅ (Admin de Lubreze)
5. Ver productos de Lubreze ✅
6. Volver a /admin ✅
7. Click sucursal "Central" ✅
8. /central/admin ✅ (Admin de Central)
```

## 🎉 Resultado Esperado

- ✅ Acceso sin restricciones a CUALQUIER sucursal
- ✅ Sin redirecciones al login
- ✅ Mensajes de éxito en consola
- ✅ Interfaz de admin funcionando normalmente

## 📞 Si persisten los problemas

1. Recarga la página completamente
2. Cierra y reabre el navegador
3. Verifica que los cambios se aplicaron (recarga del dev server)
4. Contacta para revisar logs específicos

---

## ✅ Checklist Final

- [ ] Login exitoso como Super Admin
- [ ] Acceso a `/admin` funciona
- [ ] Click en sucursales funciona sin login
- [ ] Navegación directa `/sucursal/admin` funciona
- [ ] Consola muestra mensajes de éxito
- [ ] No hay redirecciones inesperadas

¡Listo para probar! 🚀
