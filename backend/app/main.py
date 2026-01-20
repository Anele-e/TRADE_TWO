from fastapi import FastAPI
from app.core.config import get_settings
from app.api.routes import users_endpoints
from app.api.routes import auth



settings = get_settings()
app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

app.include_router(users_endpoints.router)
app.include_router(auth.router)


@app.get("/")
async def health_check():
    return {"status": "ok"}
