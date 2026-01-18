from sqlalchemy import select
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_db
from app.schemas.users import UserResponse
from app.crud_ops.users import get_user_by_id, create_user
from app.schemas.users import UserLogin, UserCreate
from app.core.security import verify_password, create_access_token
from app.models.users import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=dict)
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

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}



@router.post("/register", response_model=UserResponse)
async def register_user(user_create: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await get_user_by_id(db, user_create.id)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this ID already exists",
        )
    new_user = await create_user(db, user_create)
    return new_user