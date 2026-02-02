from pydantic_settings import BaseSettings
from pathlib import Path
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Trades Platform"
    DEBUG: bool = True
    DATABASE_URL_ASYNC: str
    DATABASE_URL_SYNC: str
    SECRET_KEY: str
   
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173",
        "http://127.0.0.1:5173",]

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()