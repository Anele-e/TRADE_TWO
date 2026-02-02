from fastapi import FastAPI
from app.core.config import get_settings
from app.api.routes import users_endpoints
from app.api.routes import auth
from fastapi.middleware.cors import CORSMiddleware



settings = get_settings()
app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

app.include_router(users_endpoints.router)
app.include_router(auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
async def health_check():
    return {"status": "ok"}
