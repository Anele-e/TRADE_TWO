from sqlalchemy.orm import declarative_base

Base = declarative_base()

from .users_model import User 
from .jobs_model import Job
from .worker_profile_model import WorkerProfile

  
