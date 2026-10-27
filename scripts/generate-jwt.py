#!/usr/bin/env python3
import sys
import time
import json
import secrets
import jwt

def main():
    if len(sys.argv) > 1:
        secret = sys.argv[1]
    else:
        # Generar secreto aleatorio criptográficamente seguro de 64 caracteres
        secret = secrets.token_hex(32)

    now = int(time.time())
    exp = now + (10 * 365 * 24 * 3600)  # 10 años

    anon_payload = {
        "role": "anon",
        "iss": "supabase",
        "iat": now,
        "exp": exp
    }

    service_payload = {
        "role": "service_role",
        "iss": "supabase",
        "iat": now,
        "exp": exp
    }

    anon_key = jwt.encode(anon_payload, secret, algorithm="HS256")
    service_key = jwt.encode(service_payload, secret, algorithm="HS256")

    if isinstance(anon_key, bytes):
        anon_key = anon_key.decode("utf-8")
    if isinstance(service_key, bytes):
        service_key = service_key.decode("utf-8")

    output = {
        "jwt_secret": secret,
        "anon_key": anon_key,
        "service_role_key": service_key
    }

    print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()
