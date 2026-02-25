import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException


UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/backend/app/static/uploads")

def save_upload_file(upload_file: UploadFile) -> str:
    try:
        extension = os.path.splitext(upload_file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{extension}"

        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        return f"/static/uploads/{unique_filename}"
    finally:
        upload_file.file.close()
