from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Annotated


import models
from database import enigine, SessionLocal
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=enigine)

app = FastAPI()

class Teacher(BaseModel):
  name: str
  department: str

origins = [
  'http://localhost:5173',

]
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_headers=['*'],
  allow_methods=['*']

)

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# add a teacher
@app.post('/teachers')
def add_teacher(teacher: Teacher, db: db_dependency):
  db_teacher = models.Teachers(name=teacher.name, department=teacher.department)
  db.add(db_teacher)
  db.commit()
  db.refresh(db_teacher)

  if not db_teacher:
    raise HTTPException(status_code=404, detail='Teacher cannot be added')

  return db_teacher

# get all teachers
@app.get('/teachers')
def get_teachers(db: db_dependency):
  db_teachers= db.query(models.Teachers).all()

  if not db_teachers:
    raise HTTPException(status_code=404, detail='No Teachers found')
  return db_teachers

# update a teacher
@app.put('/teachers/{teacher_id}')
def update_teacher(teacher: Teacher, teacher_id: int, db: db_dependency):
  db_teacher = db.query(models.Teachers).filter(models.Teachers.id == teacher_id).first()

  if not db_teacher:
    raise HTTPException(status_code=404, detail='Teacher not found')

  db_teacher.name= teacher.name
  db_teacher.department= teacher.department

  db.commit()
  db.refresh(db_teacher)

  return db_teacher

# delete a teacher
@app.delete('/teachers/{teacher_id}')
def delete_teacher(teacher_id: int, db: db_dependency):
  db_teacher = db.query(models.Teachers).filter(models.Teachers.id == teacher_id).first()

  if not db_teacher:
    raise HTTPException(status_code=404, detail='Teacher not found')

  db.delete(db_teacher)
  db.commit()

  return {"message": "Teacher deleted successfully"}
  

  