
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class Login(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "coach"

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    class Config:
        from_attributes = True

class PlayerBase(BaseModel):
    first_name: str
    last_name: str
    hand: Optional[str] = "RHP"
    primary_role: Optional[str] = "SP"
    rotation_day: Optional[str] = None
    status: Optional[str] = "Active"
    email: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None

class PlayerCreate(PlayerBase): ...
class Player(PlayerBase):
    id: int
    class Config:
        from_attributes = True

class TemplateRowBase(BaseModel):
    template_name: str
    day_of_week: str
    throwing: Optional[str] = None
    bullpen: Optional[str] = None
    plyo_meds: Optional[str] = None
    lifts: Optional[str] = None
    recovery: Optional[str] = None
    conditioning: Optional[str] = None
    notes: Optional[str] = None

class TemplateRowCreate(TemplateRowBase): ...
class TemplateRow(TemplateRowBase):
    id: int
    class Config:
        from_attributes = True

class AssignmentBase(BaseModel):
    player_id: int
    week_start: date
    template_name: str
    coach: Optional[str] = None
    notes: Optional[str] = None

class AssignmentCreate(AssignmentBase): ...
class Assignment(AssignmentBase):
    id: int
    class Config:
        from_attributes = True

class DailyLogBase(BaseModel):
    date: date
    player_id: int
    session_type: Optional[str] = None
    planned: Optional[str] = None
    completed: Optional[str] = None
    rpe: Optional[float] = None
    pain: Optional[float] = None
    velo_top: Optional[float] = None
    pitch_count: Optional[int] = None
    comments: Optional[str] = None

class DailyLogCreate(DailyLogBase): ...
class DailyLog(DailyLogBase):
    id: int
    class Config:
        from_attributes = True

class ReadinessBase(BaseModel):
    date: date
    player_id: int
    sleep_hrs: Optional[float] = None
    soreness: Optional[float] = None
    stress: Optional[float] = None
    energy: Optional[float] = None
    weight: Optional[float] = None
    hrv: Optional[float] = None
    notes: Optional[str] = None

class ReadinessCreate(ReadinessBase): ...
class Readiness(ReadinessBase):
    id: int
    class Config:
        from_attributes = True
