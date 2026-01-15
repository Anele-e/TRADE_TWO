from sqlalchemy.orm import Mapped, mapped_column, Enum, ForeignKey
from sqlalchemy.types import DateTime

from . import Base


class ClientProfile(Base):
    __tablename__ = "client_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    address: Mapped[str] = mapped_column(nullable=True)
    phone_number: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[DateTime] = mapped_column(nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(nullable=False)

    def __repr__(self) -> str:
        return f"<ClientProfile(id={self.id}, user_id={self.user_id})>"
