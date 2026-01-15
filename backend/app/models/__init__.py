from sqlalchemy.orm import declarative_base

Base = declarative_base()

from .users import User 
from .jobs import Job
  
