
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="coach")

class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    hand = Column(String, default="RHP")
    primary_role = Column(String, default="SP")
    rotation_day = Column(String)  # 1-7 or empty
    status = Column(String, default="Active")
    email = Column(String)
    phone = Column(String)
    notes = Column(Text)

class TemplateRow(Base):
    __tablename__ = "template_rows"
    id = Column(Integer, primary_key=True, index=True)
    template_name = Column(String, index=True)
    day_of_week = Column(String) # Mon..Sun
    throwing = Column(Text)
    bullpen = Column(Text)
    plyo_meds = Column(Text)
    lifts = Column(Text)
    recovery = Column(Text)
    conditioning = Column(Text)
    notes = Column(Text)

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"))
    week_start = Column(Date)  # Monday
    template_name = Column(String)
    coach = Column(String)
    notes = Column(Text)

class DailyLog(Base):
    __tablename__ = "daily_log"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    player_id = Column(Integer, ForeignKey("players.id"))
    session_type = Column(String)
    planned = Column(Text)
    completed = Column(Text)
    rpe = Column(Float)
    pain = Column(Float)
    velo_top = Column(Float)
    pitch_count = Column(Integer)
    comments = Column(Text)

class Readiness(Base):
    __tablename__ = "readiness"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    player_id = Column(Integer, ForeignKey("players.id"))
    sleep_hrs = Column(Float)
    soreness = Column(Float)
    stress = Column(Float)
    energy = Column(Float)
    weight = Column(Float)
    hrv = Column(Float)
    notes = Column(Text)
