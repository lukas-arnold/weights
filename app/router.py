from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List, Dict

from app import db_operations, schemas
from app.database import get_db

router = APIRouter(prefix="/weights")

not_found_message = "Exercise not found"


@router.post("/", response_model=schemas.Exercise, status_code=status.HTTP_201_CREATED)
def create_exercise_route(
    exercise: schemas.ExerciseCreate, db: Session = Depends(get_db)
):
    return db_operations.create_exercise(db=db, add_exercise=exercise)


@router.get("/", response_model=List[schemas.Exercise])
def read_exercises_route(db: Session = Depends(get_db)):
    exercises = db_operations.get_exercises(db)
    return exercises


@router.get("/{exercise_id}", response_model=schemas.Exercise)
def read_exercise_route(exercise_id: int, db: Session = Depends(get_db)):
    db_exercise = db_operations.get_exercise(db, exercise_id=exercise_id)
    if db_exercise is None:
        raise HTTPException(status_code=404, detail=not_found_message)
    return db_exercise


@router.delete("/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exercise_route(exercise_id: int, db: Session = Depends(get_db)):
    success = db_operations.delete_exercise(db, exercise_id=exercise_id)
    if not success:
        raise HTTPException(status_code=404, detail=not_found_message)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{exercise_id}/weighthistory",
    response_model=schemas.Weight,
    status_code=status.HTTP_201_CREATED,
)
def add_weight_entry_to_exercise(
    exercise_id: int, weight_entry: schemas.WeightCreate, db: Session = Depends(get_db)
):
    db_weight_entry = db_operations.create_weight_entry(
        db=db, exercise_id=exercise_id, weight_entry=weight_entry
    )
    if db_weight_entry is None:
        raise HTTPException(status_code=404, detail=not_found_message)
    return db_weight_entry


@router.get("/{exercise_id}/weighthistory", response_model=List[schemas.Weight])
def get_weight_history_route(exercise_id: int, db: Session = Depends(get_db)):
    db_exercise = db_operations.get_exercise(db, exercise_id)
    if not db_exercise:
        raise HTTPException(status_code=404, detail=not_found_message)

    return db_operations.get_weight_history_for_exercise(db=db, exercise_id=exercise_id)
