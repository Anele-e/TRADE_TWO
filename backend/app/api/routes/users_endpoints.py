from fastapi import APIRouter, Depends, HTTPException, status
from app.crud_ops.users import get_user_by_id, create_user, update_user, get_users_by_role
from app.api.deps import get_current_user
from app.schemas.users_schema import User, UserUpdate, WorkerProfileBase
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.crud_ops.worker_profile import update_worker_profile
from app.schemas.users_schema import SkillsUpdate

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user



@router.get("/{user_id}")
async def get_user_endpoint(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.put("/{user_id}", status_code=status.HTTP_200_OK)
async def update_user_endpoint(
    user_id: int,
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this user")

    user = await update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user_endpoint(
    user_create: User,
    db: AsyncSession = Depends(get_db)
):
    new_user = await create_user(db, user_create)
    return new_user

@router.put("/skills")
async def save_user_skills(skills_data: SkillsUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    worker_profile_update = WorkerProfileBase(skills=skills_data.skills, has_selected_skills=True)
    updated_profile = await update_worker_profile(db, current_user.id, worker_profile_update)

    if not updated_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Worker profile not found")
    

    return updated_profile

@router.put("/worker_profile/{user_id}")
async def update_worker_profile_endpoint(user_id: int, worker_profile_update: WorkerProfileBase, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this worker profile")

    updated_profile = await update_worker_profile(db, user_id, worker_profile_update)

    if not updated_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Worker profile not found")

    return updated_profile