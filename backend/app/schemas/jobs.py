from pydantic import BaseModel, ConfigDict


class Job(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    customer_id: int
    worker_id: int | None
    status: str
    created_at: str
    updated_at: str
    
class JobCreate(BaseModel):
    title: str
    description: str
    customer_id: int
    worker_id: int | None
    status: str
    created_at: str
    updated_at: str
    
class JobUpdate(BaseModel):
    title: str | None
    description: str | None
    worker_id: int | None
    status: str | None
    updated_at: str | None


class JobList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    jobs: list[Job]

