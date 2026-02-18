from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud_ops.jobs import get_job_by_id, create_job, update_job, get_nearby_jobs, get_opened_jobs
from app.api.deps import get_current_user
from app.api.deps import get_db
from app.schemas.jobs_schema import JobCreate
from app.models.users_model import User



router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_job_endpoint(job_data: JobCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = await create_job(db, job_data, current_user.id)
    return job

@router.put("/jobs/{job_id}", status_code=status.HTTP_200_OK)
async def update_job_endpoint(job_id: int, job_data: dict, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = await update_job(db, job_id, job_data, current_user.id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job

@router.get("/open", status_code=status.HTTP_200_OK)
async def get_open_jobs(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    jobs = await get_opened_jobs(db, current_user.id)
    if not jobs:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jobs not found")
    return jobs


# @router.get("/open/")to filter by skills and another to filter by location

@router.get("/jobs/{job_id}", status_code=status.HTTP_200_OK)
async def get_job_endpoint(job_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = await get_job_by_id(db, job_id, current_user.id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@router.get("/nearby", status_code=status.HTTP_200_OK)
async def get_jobs_nearby_endpoint(lat: float, lon: float, radius_km: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    jobs = await get_nearby_jobs(db, lat, lon, radius_km, current_user.id)
    if not jobs:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jobs not found")
    return jobs
    
