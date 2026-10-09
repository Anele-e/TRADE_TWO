from math import asin, cos, radians, sin, sqrt
from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="Trade Two API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TRADE_SKILLS = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Bricklaying",
    "Tiling",
    "Roofing",
    "Welding",
    "Landscaping",
    "Appliance repair",
    "HVAC",
    "Solar installation",
]


class RegisterRequest(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    password: str
    role: Literal["client", "worker"]
    location_name: str
    latitude: float
    longitude: float
    skills: list[str] = Field(default_factory=list)
    looking_for: str | None = None


class LoginRequest(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    role: str
    location_name: str
    latitude: float
    longitude: float
    skills: list[str]
    looking_for: str | None = None


class NearbyUser(UserResponse):
    distance_km: float


class AuthResponse(BaseModel):
    user: UserResponse


users: list[dict] = [
    {
        "id": 1,
        "username": "neo_plumber",
        "email": "neo@example.com",
        "first_name": "Neo",
        "last_name": "Mokoena",
        "password": "password",
        "role": "worker",
        "location_name": "Kayamandi, Stellenbosch",
        "latitude": -33.9218,
        "longitude": 18.8513,
        "skills": ["Plumbing", "Tiling"],
        "looking_for": None,
    },
    {
        "id": 2,
        "username": "ama_electric",
        "email": "ama@example.com",
        "first_name": "Amahle",
        "last_name": "Dlamini",
        "password": "password",
        "role": "worker",
        "location_name": "Mbekweni, Paarl",
        "latitude": -33.7069,
        "longitude": 18.9915,
        "skills": ["Electrical", "Solar installation"],
        "looking_for": None,
    },
    {
        "id": 3,
        "username": "thabo_client",
        "email": "thabo@example.com",
        "first_name": "Thabo",
        "last_name": "Nkosi",
        "password": "password",
        "role": "client",
        "location_name": "Cloetesville, Stellenbosch",
        "latitude": -33.9158,
        "longitude": 18.8598,
        "skills": [],
        "looking_for": "Carpentry",
    },
    {
        "id": 4,
        "username": "lerato_home",
        "email": "lerato@example.com",
        "first_name": "Lerato",
        "last_name": "Maseko",
        "password": "password",
        "role": "client",
        "location_name": "Paarl East",
        "latitude": -33.7321,
        "longitude": 18.9957,
        "skills": [],
        "looking_for": "Painting",
    },
]
next_user_id = 5


def public_user(user: dict) -> UserResponse:
    return UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        first_name=user["first_name"],
        last_name=user["last_name"],
        role=user["role"],
        location_name=user["location_name"],
        latitude=user["latitude"],
        longitude=user["longitude"],
        skills=user["skills"],
        looking_for=user.get("looking_for"),
    )


def distance_km(first: dict, second: dict) -> float:
    earth_radius_km = 6371
    lat_1 = radians(first["latitude"])
    lat_2 = radians(second["latitude"])
    delta_lat = radians(second["latitude"] - first["latitude"])
    delta_lon = radians(second["longitude"] - first["longitude"])
    haversine = (
        sin(delta_lat / 2) ** 2
        + cos(lat_1) * cos(lat_2) * sin(delta_lon / 2) ** 2
    )
    return 2 * earth_radius_km * asin(sqrt(haversine))


def find_user_by_id(user_id: int) -> dict | None:
    return next((user for user in users if user["id"] == user_id), None)


def find_user_by_username(username: str) -> dict | None:
    normalized = username.strip().lower()
    return next((user for user in users if user["username"].lower() == normalized), None)


@app.get("/")
async def root():
    return {"message": "Trade Two API is running"}


@app.get("/trade-skills")
async def trade_skills():
    return {"skills": TRADE_SKILLS}


@app.post("/auth/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    global next_user_id

    if find_user_by_username(payload.username):
        raise HTTPException(status_code=409, detail="Username is already registered")

    if any(user["email"].lower() == payload.email.strip().lower() for user in users):
        raise HTTPException(status_code=409, detail="Email is already registered")

    if payload.role == "worker" and not payload.skills:
        raise HTTPException(status_code=400, detail="Workers must select at least one skill")

    user = {
        "id": next_user_id,
        "username": payload.username.strip(),
        "email": payload.email.strip(),
        "first_name": payload.first_name.strip(),
        "last_name": payload.last_name.strip(),
        "password": payload.password,
        "role": payload.role,
        "location_name": payload.location_name.strip(),
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "skills": payload.skills if payload.role == "worker" else [],
        "looking_for": payload.looking_for if payload.role == "client" else None,
    }
    users.append(user)
    next_user_id += 1

    return AuthResponse(user=public_user(user))


@app.post("/auth/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    user = find_user_by_username(payload.username)
    if not user or user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return AuthResponse(user=public_user(user))


@app.get("/nearby", response_model=list[NearbyUser])
async def nearby_users(
    user_id: int,
    skill: str | None = Query(default=None),
    radius_km: float = Query(default=50, ge=1, le=500),
):
    current_user = find_user_by_id(user_id)
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    target_role = "client" if current_user["role"] == "worker" else "worker"
    normalized_skill = skill.strip().lower() if skill else ""
    matches = []

    for candidate in users:
        if candidate["id"] == current_user["id"] or candidate["role"] != target_role:
            continue

        if target_role == "worker" and normalized_skill:
            worker_skills = [candidate_skill.lower() for candidate_skill in candidate["skills"]]
            if normalized_skill not in worker_skills:
                continue

        candidate_distance = round(distance_km(current_user, candidate), 1)
        if candidate_distance > radius_km:
            continue

        public_candidate = public_user(candidate).model_dump()
        public_candidate["distance_km"] = candidate_distance
        matches.append(public_candidate)

    return sorted(matches, key=lambda person: person["distance_km"])
