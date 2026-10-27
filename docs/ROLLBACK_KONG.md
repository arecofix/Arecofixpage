# 🔄 Procedimiento de Rollback de Configuración de Kong Gateway

Este documento detalla el procedimiento operativo estándar para revertir la configuración declarativa de Kong en la VPS ante cualquier regresión en rutas, plugins de CORS o servicios upstream.

---

## 1. Ubicación de Archivos de Respaldo

- **En la VPS:** `/home/ubuntu/arecofix/supabase/kong.yml.bak.20261019_cors_origins`
- **En el Repositorio Local (fuera de la VPS):** `backups/kong.yml.bak.20261019_cors_origins`
- **Configuración canónica versionada:** `infra/supabase/kong.yml`

---

## 2. Procedimiento de Rollback Inmediato

### Paso 1: Restaurar archivo de configuración
Desde la máquina local o entorno de despliegue:
```bash
scp -i ./ssh-key-2026-08-30.key \
  ./backups/kong.yml.bak.20261019_cors_origins \
  ubuntu@ssh.arecofix.com.ar:/home/ubuntu/arecofix/supabase/kong.yml
```

O si se opera directamente dentro de la VPS:
```bash
cp /home/ubuntu/arecofix/supabase/kong.yml.bak.20261019_cors_origins /home/ubuntu/arecofix/supabase/kong.yml
```

### Paso 2: Reiniciar el contenedor de Kong
```bash
ssh -i ./ssh-key-2026-08-30.key ubuntu@ssh.arecofix.com.ar 'docker restart supabase-kong'
```

### Paso 3: Verificación de Salud
```bash
# Verificar que el servicio responde
curl -sI https://db.arecofix.com.ar/rest/v1/

# Ejecutar el healthcheck de CORS
node scripts/verify-cors-preflight.mjs
```

---

## 3. Checklist de Seguridad Post-Rollback
- [ ] Validar que `origins` no permita `*` en combinación con `credentials: true`.
- [ ] Confirmar que `x-guest-session` esté permitido en `postgrest`.
- [ ] Revisar logs de Kong: `docker logs supabase-kong --tail 50`.
