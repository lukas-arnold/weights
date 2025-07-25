from sqlalchemy.orm import Session
from app import models, schemas


def create_exercise(db: Session, add_exercise: schemas.ExerciseCreate):
    db_exercise = models.ExercisesDB(
        muscle_group=add_exercise.muscle_group, exercise=add_exercise.exercise
    )
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)

    if add_exercise.initial_weight is not None:
        db_weight = models.WeightsDB(
            exercise_id=db_exercise.id, weight=add_exercise.initial_weight
        )
        db.add(db_weight)
        db.commit()
        db.refresh(db_weight)
        db.refresh(
            db_exercise
        )  # Refresh the parent exercise to ensure weight_history is updated

    return db_exercise


def get_exercise(db: Session, exercise_id: int):
    return (
        db.query(models.ExercisesDB)
        .filter(models.ExercisesDB.id == exercise_id)
        .first()
    )


def get_exercises(db: Session):
    return db.query(models.ExercisesDB).all()


def delete_exercise(db: Session, exercise_id: int):
    db_exercise = (
        db.query(models.ExercisesDB)
        .filter(models.ExercisesDB.id == exercise_id)
        .first()
    )
    if db_exercise:
        db.delete(db_exercise)
        db.commit()
        return True
    return False


def create_weight_entry(
    db: Session, exercise_id: int, weight_entry: schemas.WeightCreate
):
    db_exercise = (
        db.query(models.ExercisesDB)
        .filter(models.ExercisesDB.id == exercise_id)
        .first()
    )
    if not db_exercise:
        return None

    db_weight = models.WeightsDB(exercise_id=exercise_id, weight=weight_entry.weight)
    db.add(db_weight)
    db.commit()
    db.refresh(db_weight)

    db.refresh(db_exercise)

    return db_weight


def get_weight_history_for_exercise(db: Session, exercise_id: int):
    return (
        db.query(models.WeightsDB)
        .filter(models.WeightsDB.exercise_id == exercise_id)
        .order_by(models.WeightsDB.created_at.desc())
        .all()
    )
