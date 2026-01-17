from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from typing import AsyncGenerator

from dotenv import load_dotenv
from app.core.config import get_settings



settings = get_settings()
DATABASE_URL_ASYNC = settings.DATABASE_URL_ASYNC
async_engine = create_async_engine(DATABASE_URL_ASYNC, echo=True, future=True)

AsyncSessionLocal = async_sessionmaker(bind=async_engine, class_=AsyncSession, expire_on_commit=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()