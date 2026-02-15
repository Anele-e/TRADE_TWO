from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import DateTime
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import func
from sqlalchemy import String 

from . import Base


class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    bio: Mapped[str] = mapped_column(nullable=True)
    latitude: Mapped[float | None] = mapped_column(nullable=True)
    longitude: Mapped[float | None] = mapped_column(nullable=True)
    skills: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=True)
    rating: Mapped[float] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
    has_selected_skills: Mapped[bool] = mapped_column(nullable=False, default=False)
    def __repr__(self) -> str:
        return f"<WorkerProfile(id={self.id}, user_id={self.user_id}, rating={self.rating})>"

   
