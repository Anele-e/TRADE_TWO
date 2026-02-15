from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.users_model import User as UserModel

from app.schemas.users_schema import UserCreate, UserUpdate, WorkerProfileCreate, User
from app.core.security import hash_password

async def get_user_by_id(db: AsyncSession, user_id: int) -> UserModel | None:
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    return result.scalars().first()

async def create_user(db: AsyncSession, user_create: UserCreate) -> UserModel:
    new_user = UserModel(
        username=user_create.username,
        email=user_create.email,
        first_name=user_create.first_name,
        last_name=user_create.last_name,
        role=user_create.role,
        hashed_password=hash_password(user_create.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user



async def update_user(db: AsyncSession, user_id: int, user_update: UserUpdate) -> User | None:
    user = await get_user_by_id(db, user_id)
    if not user:
        return None
    user_update = user_update.model_dump(exclude_unset=True)
    if "password" in user_update:
        user_update["hashed_password"] = hash_password(user_update.pop("password"))

    for field, value in user_update.items():
        setattr(user, field, value)

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def get_all_users(db: AsyncSession) -> list:
    result = await db.execute(select(UserModel))
    users = result.scalars().all()
    return users

async def get_users_by_role(db: AsyncSession, role: str) -> list:
    result = await db.execute(select(UserModel).where(UserModel.role == role))
    users = result.scalars().all()
    return users

async def delete_user(db: AsyncSession, user_id: int) -> bool:
    user = await get_user_by_id(db, user_id)
    if not user:
        return False

    await db.delete(user)
    await db.commit()
    return True


async def get_client(db: AsyncSession, client_id: int) -> User | None:
    result = await db.execute(select(UserModel).where(UserModel.id == client_id, UserModel.role == "client"))
    return result.scalars().first()
