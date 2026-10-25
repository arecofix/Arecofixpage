#!/usr/bin/env python3
import json
import os
import re
import secrets
import subprocess
import time
import jwt

BASE_DIR = "/home/ubuntu/arecofix"
COMPOSE_FILE = os.path.join(BASE_DIR, "docker-compose.yml")
ENV_FILE = os.path.join(BASE_DIR, ".env")
OUTPUT_FILE = os.path.join(BASE_DIR, "new_keys_info.txt")

def main():
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

    # Guardar en archivo seguro con permisos 600
    with open(OUTPUT_FILE, "w") as f:
        f.write(f"JWT_SECRET={jwt_secret}\n")
        f.write(f"ANON_KEY={anon_key}\n")
        f.write(f"SERVICE_ROLE_KEY={service_key}\n")
    os.chmod(OUTPUT_FILE, 0o600)

    print("[T+1] Actualizando docker-compose.yml con nuevo JWT_SECRET...")
    with open(COMPOSE_FILE, "r") as f:
        compose_content = f.read()

    compose_content = re.sub(r"PGRST_JWT_SECRET:\s*.*", f"PGRST_JWT_SECRET: {jwt_secret}", compose_content)
    compose_content = re.sub(r"GOTRUE_JWT_SECRET:\s*.*", f"GOTRUE_JWT_SECRET: {jwt_secret}", compose_content)

    with open(COMPOSE_FILE, "w") as f:
        f.write(compose_content)

    print("[T+2] Reiniciando supabase rest, auth y kong con --force-recreate...")
    subprocess.run(["docker", "compose", "-p", "arecofix", "up", "-d", "--force-recreate", "rest", "auth", "kong"], cwd=BASE_DIR, check=True)
    time.sleep(3)

    print("[T+4] Actualizando .env en VPS...")
    with open(ENV_FILE, "r") as f:
        env_content = f.read()

    env_content = re.sub(r"SUPABASE_KEY=.*", f"SUPABASE_KEY={anon_key}", env_content)
    env_content = re.sub(r"SUPABASE_SERVICE_ROLE_KEY=.*", f"SUPABASE_SERVICE_ROLE_KEY={service_key}", env_content)

    with open(ENV_FILE, "w") as f:
        f.write(env_content)

    print("[✓] Rotación en VPS aplicada con éxito.")
    print(f"PGRST_JWT_SECRET: <REDACTED> (len={len(jwt_secret)})")
    print(f"ANON_KEY: <REDACTED> (len={len(anon_key)})")
    print(f"SERVICE_ROLE_KEY: <REDACTED> (len={len(service_key)})")

if __name__ == "__main__":
    main()
