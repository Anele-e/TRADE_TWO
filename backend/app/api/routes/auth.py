from sqlalchemy import select
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_db
from app.crud_ops.users import get_user_by_id, create_user
from app.schemas.users_schema import UserLogin, UserCreate, WorkerProfileCreate
from app.core.security import verify_password, create_access_token
from app.models.users_model import User
from app.crud_ops.worker_profile import create_worker_profile

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
async def login(user_login: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(User.username == user_login.username)
    )
    user = result.scalars().first()
    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    token = create_access_token(subject=str(user.id))
    return {"token": token, "token_type": "bearer"}



@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user_create: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await db.execute(select(User).where((User.username == user_create.username) | (User.email == user_create.email)))
    if existing_user.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This User already exists",
        )
    new_user = await create_user(db, user_create)
    has_selected = False
    if user_create.role == "WORKER":
        worker_profile_create = WorkerProfileCreate(user_id=new_user.id, has_selected_skills=False)
        worker_profile = await create_worker_profile(db, worker_profile_create)
        has_selected = worker_profile.has_selected_skills
    token = create_access_token(subject=str(new_user.id))
    return {
        "token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "role": new_user.role,
            "has_selected_skills": has_selected
        }
    }