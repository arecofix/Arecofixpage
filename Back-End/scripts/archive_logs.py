import os
import csv
import boto3
from datetime import datetime, timedelta
from supabase import create_client, Client

url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "") 

R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")

def archive_audit_logs():
    if not all([url, key, R2_ACCOUNT_ID, R2_ACCESS_KEY, R2_SECRET_KEY]):
        print("Faltan variables de entorno para archivar los logs.")
        return

    supabase: Client = create_client(url, key)

    today = datetime.now()
    first_day_of_current_month = today.replace(day=1)
    last_day_of_previous_month = first_day_of_current_month - timedelta(days=1)
    
    start_date = last_day_of_previous_month.replace(day=1).isoformat()
    end_date = first_day_of_current_month.isoformat()
    
    month_name = last_day_of_previous_month.strftime("%Y_%m")
    csv_filename = f"audit_{month_name}.csv"
    
    print(f"1. Consultando logs desde {start_date} hasta {end_date}...")
    
    all_logs = []
    has_more = True
    page = 0
    limit = 1000
    
    while has_more:
        res = supabase.table("audit_logs").select("*") \
            .gte("created_at", start_date) \
            .lt("created_at", end_date) \
            .range(page * limit, (page + 1) * limit - 1) \
            .execute()
            
        data = res.data
        if not data:
            break
            
        all_logs.extend(data)
        if len(data) < limit:
            has_more = False
        page += 1

    if not all_logs:
        print("No hay logs para archivar este mes.")
        return

    print(f"2. Convirtiendo {len(all_logs)} registros a CSV...")
    keys = all_logs[0].keys()
    with open(csv_filename, 'w', newline='', encoding='utf-8') as output_file:
        dict_writer = csv.DictWriter(output_file, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(all_logs)
        
    print("3. Subiendo a R2...")
    s3 = boto3.client('s3',
      endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
      aws_access_key_id=R2_ACCESS_KEY,
      aws_secret_access_key=R2_SECRET_KEY,
      region_name="auto"
    )
    s3.upload_file(csv_filename, "arecofix-backups", f"logs/{csv_filename}")
    
    print("4. Verificando subida y limpiando Supabase...")
    # Lanza excepción si el archivo no subió bien
    s3.head_object(Bucket="arecofix-backups", Key=f"logs/{csv_filename}")
    
    # Ejecutamos RPC para borrar los logs archivados de forma segura
    res = supabase.rpc('delete_old_audit_logs', {'end_date': end_date}).execute()
    
    os.remove(csv_filename)
    print("Archivado mensual completado con éxito.")

if __name__ == "__main__":
    archive_audit_logs()
