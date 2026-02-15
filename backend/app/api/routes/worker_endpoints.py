from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.schemas.users_schema import User, WorkerProfileBase
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.crud_ops.worker_profile import update_worker_profile, get_worker_profile_by_user_id,  create_worker_profile, get_all_worker_profiles


router = APIRouter(prefix="/worker", tags=["worker"])

@router.get("/workers")
async def get_workers(db: AsyncSession = Depends(get_db)):
    worker_profiles = await get_all_worker_profiles(db)
    return worker_profiles



