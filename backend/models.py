from sqlalchemy import Column, String, Integer
from database import Base

class Teachers(Base):
  __tablename__ = 'teachers'

  id= Column(Integer, primary_key=True, index=True)
  name= Column(String, index=True)
  department= Column(String, index=True)