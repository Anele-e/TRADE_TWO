import datetime
from pydantic import BaseModel, ConfigDict



class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    role: str



class UserPrivate(User):
    hashed_password: str

class UserList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    users: list[User]

class UserCreate(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    role: str
    password: str
class UserUpdate(BaseModel):
    username: str | None = None
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    role: str | None = None
    password: str | None = None
    
class UserLogin(BaseModel):
    username: str
    password: str

class WorkerProfileBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    bio: str | None = None
    latitude: float | None = None
    longitude: float | None= None
    skills: list[str] | None= None
    has_selected_skills: bool | None= None

class WorkerProfileCreate(WorkerProfileBase):
    user_id: int
    bio: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    skills: list[str] | None = None
    has_selected_skills: bool = False

class WorkerProfileUpdate(BaseModel):
    bio: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    skills: list[str] | None = None
    rating: float | None = None
    has_selected_skills: bool | None = None

class WorkerProfileRead(WorkerProfileBase):
    id: int
    user_id: int
    rating: float | None
    created_at: datetime.datetime
    updated_at: datetime.datetime

class SkillsUpdate(BaseModel):
    skills: list[str]

class WorkerProfileResponse(WorkerProfileBase):
    id: int
    user_id: int
    rating: float | None = None