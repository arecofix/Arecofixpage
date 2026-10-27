#!/usr/bin/env python3
import argparse
import json
import os
import re
import secrets
import subprocess
import sys
import time
import jwt

def parse_args():
    parser = argparse.ArgumentParser(description="Arecofix JWT Secret & Key Rotation Script")
    parser.add_argument(
        "--env",
        choices=["production", "staging"],
        default="production",
        help="Target environment (default: production)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Simulate key generation and configuration changes without writing files or restarting docker services"
    )
    parser.add_argument(
        "--base-dir",
        default=None,
        help="Custom base directory override"
    )
    return parser.parse_args()

def main():
    args = parse_args()

    if args.base_dir:
        base_dir = args.base_dir
    elif args.env == "staging":
        base_dir = "/home/ubuntu/arecofix-staging"
    else:
        base_dir = "/home/ubuntu/arecofix"

    compose_project = "supabase-staging" if args.env == "staging" else "arecofix"
    compose_file = os.path.join(base_dir, "docker-compose.yml")
    env_file = os.path.join(base_dir, ".env")
    output_file = os.path.join(base_dir, "new_keys_info.txt")

    print(f"=== INICIANDO ROTACIÓN JWT [{args.env.upper()}] (dry_run={args.dry_run}) ===")
    print(f"Base Directory: {base_dir}")
    print(f"Docker Compose Project: {compose_project}")

    if not os.path.exists(compose_file):
        print(f"[-] ERROR: docker-compose.yml no encontrado en {compose_file}", file=sys.stderr)
        sys.exit(1)

    if not os.path.exists(env_file):
        print(f"[-] ERROR: .env no encontrado en {env_file}", file=sys.stderr)
        sys.exit(1)

    print("[T+1] Generando nuevo JWT_SECRET criptográfico de 64 caracteres...")
    jwt_secret = secrets.token_hex(32)
    now = int(time.time())
    exp = now + (10 * 365 * 24 * 3600)

    anon_payload = {"role": "anon", "iss": "supabase", "iat": now, "exp": exp}
    service_payload = {"role": "service_role", "iss": "supabase", "iat": now, "exp": exp}

    anon_key = jwt.encode(anon_payload, jwt_secret, algorithm="HS256")
    service_key = jwt.encode(service_payload, jwt_secret, algorithm="HS256")

    if isinstance(anon_key, bytes):
        anon_key = anon_key.decode("utf-8")
    if isinstance(service_key, bytes):
        service_key = service_key.decode("utf-8")

    print(f"[+] Claves generadas: JWT_SECRET (len={len(jwt_secret)}), ANON_KEY (len={len(anon_key)}), SERVICE_ROLE_KEY (len={len(service_key)})")

    if args.dry_run:
        print("[DRY-RUN] Simulación de guardado en new_keys_info.txt (omitido)")
        print(f"[DRY-RUN] Simulación de actualización de {compose_file}:")
        print(f"          PGRST_JWT_SECRET -> <REDACTED> (len={len(jwt_secret)})")
        print(f"          GOTRUE_JWT_SECRET -> <REDACTED> (len={len(jwt_secret)})")
        print(f"[DRY-RUN] Simulación de comando: docker compose -p {compose_project} up -d --force-recreate rest auth kong")
        print(f"[DRY-RUN] Simulación de actualización de {env_file}:")
        print(f"          SUPABASE_KEY -> <REDACTED_ANON> (len={len(anon_key)})")
        print(f"          SUPABASE_SERVICE_ROLE_KEY -> <REDACTED_SERVICE> (len={len(service_key)})")
        print("[✓] DRY-RUN completado con éxito. No se aplicó ningún cambio destructivo.")
        return

    # Modo REAL
    # Guardar en archivo seguro con permisos 600
    with open(output_file, "w") as f:
        f.write(f"JWT_SECRET={jwt_secret}\n")
        f.write(f"ANON_KEY={anon_key}\n")
        f.write(f"SERVICE_ROLE_KEY={service_key}\n")
    os.chmod(output_file, 0o600)
    print(f"[+] Claves respaldadas en {output_file} (permisos 600)")

    print(f"[T+1] Actualizando {compose_file} con nuevo JWT_SECRET...")
    with open(compose_file, "r") as f:
        compose_content = f.read()

    compose_content = re.sub(r"PGRST_JWT_SECRET:\s*.*", f"PGRST_JWT_SECRET: {jwt_secret}", compose_content)
    compose_content = re.sub(r"GOTRUE_JWT_SECRET:\s*.*", f"GOTRUE_JWT_SECRET: {jwt_secret}", compose_content)

    with open(compose_file, "w") as f:
        f.write(compose_content)

    print(f"[T+2] Reiniciando contenedores rest, auth y kong con --force-recreate (proyecto {compose_project})...")
    subprocess.run(
        ["docker", "compose", "-p", compose_project, "up", "-d", "--force-recreate", "rest", "auth", "kong"],
        cwd=base_dir,
        check=True
    )
    time.sleep(3)

    print(f"[T+4] Actualizando {env_file}...")
    with open(env_file, "r") as f:
        env_content = f.read()

    env_content = re.sub(r"SUPABASE_KEY=.*", f"SUPABASE_KEY={anon_key}", env_content)
    env_content = re.sub(r"SUPABASE_SERVICE_ROLE_KEY=.*", f"SUPABASE_SERVICE_ROLE_KEY={service_key}", env_content)

    with open(env_file, "w") as f:
        f.write(env_content)

    print("[✓] Rotación aplicada con éxito.")
    print(f"PGRST_JWT_SECRET: <REDACTED> (len={len(jwt_secret)})")
    print(f"ANON_KEY: <REDACTED> (len={len(anon_key)})")
    print(f"SERVICE_ROLE_KEY: <REDACTED> (len={len(service_key)})")

if __name__ == "__main__":
    main()
