from pydantic import BaseModel, ConfigDict


class Job(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    customer_id: int
    worker_id: int | None
    status: str
    price: float | None
    created_at: str
    updated_at: str
    latitude: float | None
    longitude: float | None
    location_address: str | None
    
class JobCreate(BaseModel):
    title: str
    description: str
    worker_id: int | None
    price: float | None
    latitude: float | None
    longitude: float | None
    location_address: str | None


class JobUpdate(BaseModel):
    title: str | None
    description: str | None
    worker_id: int | None
    status: str | None
    price: float | None
    updated_at: str | None
    latitude: float | None
    longitude: float | None
    location_address: str | None


class JobList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    jobs: list[Job]

