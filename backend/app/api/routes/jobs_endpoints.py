from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud_ops.jobs import get_job_by_id, create_job, update_job
from app.api.deps import get_current_user
from app.api.deps import get_db
from schemas.jobs_schema import JobCreate

router = APIRouter()

@router.post("/jobs/", status_code=status.HTTP_201_CREATED)
def create_job_endpoint(job_data: JobCreate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    job = create_job(db, job_data, current_user["id"])
    return job

@router.put("/jobs/{job_id}", status_code=status.HTTP_200_OK)
def update_job_endpoint(job_id: int, job_data: dict, current_user: dict = Depends(get_current_user)):
    job = update_job(job_id, job_data, current_user["id"])
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job

@router.get("/jobs/{job_id}", status_code=status.HTTP_200_OK)
def get_job_endpoint(job_id: int, current_user: dict = Depends(get_current_user)):
    job = get_job_by_id(job_id, current_user["id"])
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job