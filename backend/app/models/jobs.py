from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import DateTime
from sqlalchemy import Enum, ForeignKey
from enum import Enum as PyEnum
from datetime import datetime

from . import Base

class JobStatus(PyEnum):
    OPEN = "open"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    worker_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus, name="job_status_enum"), default=JobStatus.OPEN, nullable=False)
    created_at: Mapped[datetime] = mapped_column(nullable=False)
    updated_at: Mapped[datetime] = mapped_column(nullable=False)
    
