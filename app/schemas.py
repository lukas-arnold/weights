from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class WeightBase(BaseModel):
    weight: float = Field(..., examples=[49.5])


class Weight(WeightBase):
    id: int
    exercise_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExerciseBase(BaseModel):
    muslce_group: str = Field(..., examples=["Brust"])
    exercise: str = Field(..., examples=["Bankdrücken"])


class ExerciseCreate(ExerciseBase):
    initial_weight: float = Field(..., examples=[49.5])


class Exercise(ExerciseBase):
    id: int
    current_weight: Optional[float] = None
    weight_history: List[Weight] = []

    class Config:
        from_attributes = True
