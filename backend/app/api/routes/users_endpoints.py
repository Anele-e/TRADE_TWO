from fastapi import APIRouter, Depends, HTTPException, status
from app.crud_ops.users import get_user_by_id, create_user, update_user, get_users_by_role
from backend.app.api.deps import get_current_user
from backend.app.schemas.users import User, UserUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.api.deps import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model=User)
async def get_user_endpoint(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.put("/{user_id}", response_model=User)
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
# @router.get("/me", response_model=User)
# async def read_current_user(current_user: User = Depends(get_current_user)):
#     return current_user

@router.get("/workers")
async def get_workers(user: User = Depends(get_users_by_role), db: AsyncSession = Depends(get_db)):
    workers = await get_users_by_role(db, role="worker")
    return workers



