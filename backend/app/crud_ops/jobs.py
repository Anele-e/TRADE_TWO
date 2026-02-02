from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.jobs_model import Job, JobStatus
from app.schemas.jobs_schema import JobCreate, JobUpdate
from datetime import datetime

async def get_job_by_id(db: AsyncSession, job_id: int) -> Job | None:
    result = await db.execute(select(Job).where(Job.id == job_id))
    return result.scalars().first()

async def create_job(db: AsyncSession, job_create: JobCreate, current_user_id: int) -> Job:
    date_now = datetime.now()
    new_job = Job(
        title=job_create.title,
        description=job_create.description,
        customer_id=current_user_id,
        worker_id=job_create.worker_id,
        status=JobStatus.OPEN,
        price=job_create.price,
        latitude=job_create.latitude,
        longitude=job_create.longitude,
        location_address=job_create.location_address,
        created_at=date_now,
        updated_at=date_now    
    )
    db.add(new_job)
    await db.commit()
    await db.refresh(new_job)
    return new_job

async def update_job(db: AsyncSession, job_id: int, job_update: JobUpdate) -> Job | None:
    job = await get_job_by_id(db, job_id)
    if not job:
        return None

    for field, value in job_update.model_dump(exclude_unset=True).items():
        setattr(job, field, value)

    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job
