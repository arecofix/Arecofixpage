import os
import subprocess
import boto3
from datetime import datetime
from cryptography.fernet import Fernet

# Configuración de variables de entorno
DB_URL = os.getenv("SUPABASE_DB_URL") 
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")
ENCRYPTION_KEY = os.getenv("BACKUP_ENCRYPTION_KEY") # Debe ser generada con Fernet.generate_key()

def run_backup():
    if not all([DB_URL, R2_ACCOUNT_ID, R2_ACCESS_KEY, R2_SECRET_KEY, ENCRYPTION_KEY]):
        print("Faltan variables de entorno para ejecutar el backup.")
        return

    date_str = datetime.now().strftime("%Y-%m-%d")
    raw_filename = f"arecofix_backup_{date_str}.sql"
    enc_filename = f"{raw_filename}.gz.enc"
    
    print("1. Ejecutando pg_dump...")
    # Usamos pg_dump y gzip en pipeline. Requiere tener pg_dump instalado en la máquina (ej: ubuntu-latest en GitHub Actions)
    dump_cmd = f"pg_dump \"{DB_URL}\" --clean | gzip > {raw_filename}.gz"
    subprocess.run(dump_cmd, shell=True, check=True)
    
    print("2. Cifrando el archivo de backup...")
    cipher = Fernet(ENCRYPTION_KEY.encode())
    with open(f"{raw_filename}.gz", "rb") as f_in:
        encrypted_data = cipher.encrypt(f_in.read())
        
    with open(enc_filename, "wb") as f_out:
        f_out.write(encrypted_data)
        
    print("3. Subiendo a Cloudflare R2...")
    s3 = boto3.client('s3',
      endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
      aws_access_key_id=R2_ACCESS_KEY,
      aws_secret_access_key=R2_SECRET_KEY,
      region_name="auto"
    )
    
    s3.upload_file(enc_filename, "arecofix-backups", f"database/{enc_filename}")
    
    # Limpieza
    os.remove(f"{raw_filename}.gz")
    os.remove(enc_filename)
    print("Backup finalizado con éxito.")

if __name__ == "__main__":
    run_backup()
