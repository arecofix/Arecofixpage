import os
import boto3
from botocore.exceptions import ClientError
from flask import current_app

class R2StorageService:
    def __init__(self):
        self.bucket_name = "arecofix-assets"
        account_id = os.getenv('R2_ACCOUNT_ID', '')
        self.s3_client = boto3.client('s3',
            endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com" if account_id else None,
            aws_access_key_id=os.getenv("R2_ACCESS_KEY"),
            aws_secret_access_key=os.getenv("R2_SECRET_KEY"),
            region_name="auto"
        )

    def generate_presigned_url(self, file_path, expires_in=3600):
        """
        Genera una URL temporal para que Angular pueda descargar/ver un documento privado.
        """
        try:
            response = self.s3_client.generate_presigned_url('get_object',
                Params={'Bucket': self.bucket_name, 'Key': file_path},
                ExpiresIn=expires_in)
            return response
        except ClientError as e:
            if current_app:
                current_app.logger.error(e)
            else:
                print(f"Error generando URL pre-firmada: {e}")
            return None

    def upload_heavy_document(self, file_obj, folder, filename, content_type="application/pdf"):
        """
        Sube un documento pesado desde Flask a R2 en chunks.
        Ej: folder='private/schematics'
        """
        full_path = f"{folder}/{filename}"
        try:
            # Upload_fileobj maneja multipart uploads automáticamente para archivos pesados (streaming directo)
            self.s3_client.upload_fileobj(
                file_obj, 
                self.bucket_name, 
                full_path,
                ExtraArgs={'ContentType': content_type}
            )
            return full_path
        except ClientError as e:
            if current_app:
                current_app.logger.error(f"Error subiendo documento a R2: {e}")
            else:
                print(f"Error subiendo documento a R2: {e}")
            raise
