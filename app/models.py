from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float, DateTime, ForeignKey, func
from app.database import Base
from datetime import datetime
from typing import List


class ExercisesDB(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    muscle_group: Mapped[str] = mapped_column(String, nullable=False)
    exercise: Mapped[str] = mapped_column(String, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), onupdate=func.now()
    )

    weight_history: Mapped[List["WeightsDB"]] = relationship(
        back_populates="exercise",
        cascade="all, delete-orphan",
        order_by="WeightsDB.created_at.desc()",
    )


class WeightsDB(Base):
    __tablename__ = "weights"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"), nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    exercise: Mapped["ExercisesDB"] = relationship(back_populates="weight_history")
