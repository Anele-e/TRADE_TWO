from sqlalchemy.orm import Mapped, mapped_column, Enum, ForeignKey
from sqlalchemy.types import DateTime

from . import Base


class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    bio: Mapped[str] = mapped_column(nullable=True)
    skills: Mapped[str] = mapped_column(nullable=True)
    rating: Mapped[float] = mapped_column(nullable=True)
    created_at: Mapped[DateTime] = mapped_column(nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(nullable=False)
    def __repr__(self) -> str:
        return f"<WorkerProfile(id={self.id}, user_id={self.user_id}, rating={self.rating})>"

   
