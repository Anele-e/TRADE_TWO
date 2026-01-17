from sqlalchemy.orm import declarative_base

Base = declarative_base()

from .users import User 
from .jobs import Job
from .worker_profile import WorkerProfile
from .client_profile import ClientProfile
  
