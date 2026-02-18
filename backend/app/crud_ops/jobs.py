from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.jobs_model import Job, JobStatus
from app.schemas.jobs_schema import JobCreate, JobUpdate
from datetime import datetime
import math

async def get_job_by_id(db: AsyncSession, job_id: int, user_id: int) -> Job | None:
    result = await db.execute(select(Job).where(Job.id == job_id, Job.customer_id == user_id))
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

async def update_job(db: AsyncSession, job_id: int, job_update: JobUpdate, user_id: int) -> Job | None:
    job = await get_job_by_id(db, job_id, user_id)
    if not job:
        return None

    for field, value in job_update.model_dump(exclude_unset=True).items():
        setattr(job, field, value)

    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job

async def get_opened_jobs(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Job).options(selectinload(Job.customer))
        .where(
            Job.status == JobStatus.OPEN, Job.customer_id != user_id).order_by(
                Job.created_at.desc())
        )
    jobs = result.scalars().all()
    return jobs

async def get_nearby_jobs(lat: float, lon: float, radius_km: int, db: AsyncSession, user_id: int):
    deg_lat = radius_km / 111.0
    deg_lon = radius_km / (111.0 * abs(math.cos(math.radians(lat))))
    min_lat, max_lat = lat - deg_lat, lat + deg_lat
    min_lon, max_lon = lon - deg_lon, lon + deg_lon
    
    jobs = await db.execute(select(Job).where(Job.status == JobStatus.OPEN, Job.latitude.between(min_lat, max_lat), Job.longitude.between(min_lon, max_lon), Job.customer_id != user_id))
    return jobs
