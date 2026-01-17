from sqlalchemy import Enum
from sqlalchemy.orm import Mapped, mapped_column
from enum import Enum as PyEnum

from . import Base

class UserRole(PyEnum):
    CUSTOMER = "customer"
    WORKER = "worker"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    first_name: Mapped[str] = mapped_column(nullable=False)
    last_name: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role_enum"), nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)

