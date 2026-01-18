from fastapi import FastAPI
from app.core.config import get_settings
from backend.app.api.routes import users_endpoints
from backend.app.api.routes import auth



settings = get_settings()
app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

app.include_router(users_endpoints.router)
app.include_router(auth.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
