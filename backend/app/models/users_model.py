from sqlalchemy import Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum as PyEnum

from . import Base

class UserRole(PyEnum):
    CUSTOMER = "CUSTOMER"
    WORKER = "WORKER"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    customer_jobs = relationship(
        "Job",
        foreign_keys="[Job.customer_id]",
        back_populates="customer"
    )

    worker_jobs = relationship(
        "Job",
        foreign_keys="[Job.worker_id]",
        back_populates="worker"
    )

    username: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    first_name: Mapped[str] = mapped_column(nullable=False)
    last_name: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role_enum"), nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)

