from fastapi import FastAPI
from app.core.config import get_settings
from app.api.routes import users_endpoints
from app.api.routes import auth
from app.api.routes import jobs_endpoints
from app.api.routes import worker_endpoints
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi.staticfiles import StaticFiles


settings = get_settings()
app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

UPLOAD_DIR = os.getenv("UPLOAD_DIR")
if UPLOAD_DIR:
    os.makedirs(UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(auth.router)
app.include_router(users_endpoints.router)
app.include_router(worker_endpoints.router)
app.include_router(jobs_endpoints.router)


@app.get("/")
async def health_check():
    return {"status": "ok"}
