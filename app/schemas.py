from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class WeightBase(BaseModel):
    weight: float = Field(..., examples=[49.5])


class WeightCreate(WeightBase):
    pass


class Weight(WeightBase):
    id: int
    exercise_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ExerciseBase(BaseModel):
    muscle_group: str = Field(..., examples=["Brust"])
    exercise: str = Field(..., examples=["Bankdrücken"])


class ExerciseCreate(ExerciseBase):
    initial_weight: float = Field(..., examples=[49.5])


class Exercise(ExerciseBase):
    id: int
    updated_at: datetime
    weight_history: Optional[List[Weight]] = None

    class Config:
        from_attributes = True
