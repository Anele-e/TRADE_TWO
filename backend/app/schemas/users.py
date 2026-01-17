from pydantic import BaseModel, ConfigDict



class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    role: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "username": "johndoe",
                "email": "johndoe@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "role": "worker"
            }
        }

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
    username: str | None
    email: str | None
    first_name: str | None
    last_name: str | None
    role: str | None
    password: str | None
    
class UserLogin(BaseModel):
    username: str
    password: str