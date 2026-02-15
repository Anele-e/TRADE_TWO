from app.models.worker_profile_model import WorkerProfile
from app.schemas.users_schema import WorkerProfileCreate, WorkerProfileUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select



async def create_worker_profile(db: AsyncSession, worker_profile_create: WorkerProfileCreate) -> WorkerProfile:
    new_profile = WorkerProfile(**worker_profile_create.model_dump())
    db.add(new_profile)
    await db.commit()
    await db.refresh(new_profile)
    return new_profile

async def get_worker_profile_by_id(
    db: AsyncSession,
    profile_id: int
) -> WorkerProfile | None:
    result = await db.execute(
        select(WorkerProfile).where(WorkerProfile.id == profile_id)
    )
    return result.scalars().first()

async def get_worker_profile_by_user_id(
    db: AsyncSession,
    user_id: int
) -> WorkerProfile | None:
    result = await db.execute(
        select(WorkerProfile).where(WorkerProfile.user_id == user_id)
    )
    return result.scalars().first()


async def get_all_worker_profiles(
    db: AsyncSession
) -> list[WorkerProfile]:
    result = await db.execute(select(WorkerProfile))
    return result.scalars().all()

async def update_worker_profile(
    db: AsyncSession,
    user_id: int,
    worker_profile_update: WorkerProfileUpdate
) -> WorkerProfile | None:
    
    profile = await get_worker_profile_by_user_id(db, user_id)

    if not profile:
        return None

    update_data = worker_profile_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(profile, field, value)

    db.add(profile)
    await db.commit()
    await db.refresh(profile)

    return profile


async def delete_worker_profile(
    db: AsyncSession,
    profile_id: int
) -> bool:
    
    profile = await get_worker_profile_by_id(db, profile_id)

    if not profile:
        return False

    await db.delete(profile)
    await db.commit()

    return True