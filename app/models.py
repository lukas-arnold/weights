from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class ExercisesDB(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    muscle_group = Column(String, nullable=False)
    exercise = Column(String, nullable=False)
    weight_history = relationship(
        "WeightsDB",
        back_populates="exercise",
        cascade="all, delete-orphan",
        order_by="WeightsDB.created_at.desc()",
    )


class WeightsDB(Base):
    __tablename__ = "weights"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    weight = Column(Float, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    exercise = relationship("ExercisesDB", back_populates="history")
