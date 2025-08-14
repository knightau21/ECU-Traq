
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
from typing import List
import os

from .database import Base, engine, get_db
from . import models, schemas
from .auth import get_current_user, get_password_hash, verify_password, create_access_token

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ECU Pitching Program Manager API")

origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed admin
from sqlalchemy.orm import Session as Sess
with Sess(bind=engine) as db:
    if not db.query(models.User).filter(models.User.email=="admin@ecu.local").first():
        admin = models.User(email="admin@ecu.local", hashed_password=get_password_hash("admin123"), role="admin")
        db.add(admin); db.commit()

@app.post("/auth/token", response_model=schemas.Token)
def login(data: schemas.Login, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email==data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token}

# --- Players ---
@app.get("/players", response_model=List[schemas.Player])
def list_players(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(models.Player).all()

@app.post("/players", response_model=schemas.Player)
def create_player(p: schemas.PlayerCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = models.Player(**p.dict())
    db.add(m); db.commit(); db.refresh(m); return m

@app.put("/players/{pid}", response_model=schemas.Player)
def update_player(pid: int, p: schemas.PlayerCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = db.query(models.Player).get(pid)
    if not m: raise HTTPException(404, "Not found")
    for k,v in p.dict().items(): setattr(m,k,v)
    db.commit(); db.refresh(m); return m

@app.delete("/players/{pid}")
def delete_player(pid: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = db.query(models.Player).get(pid)
    if not m: raise HTTPException(404, "Not found")
    db.delete(m); db.commit(); return {"ok": True}

# --- Templates ---
@app.get("/templates", response_model=List[schemas.TemplateRow])
def list_templates(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(models.TemplateRow).all()

@app.post("/templates", response_model=schemas.TemplateRow)
def create_template_row(t: schemas.TemplateRowCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = models.TemplateRow(**t.dict()); db.add(m); db.commit(); db.refresh(m); return m

@app.delete("/templates/{tid}")
def delete_template_row(tid: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = db.query(models.TemplateRow).get(tid)
    if not m: raise HTTPException(404, "Not found")
    db.delete(m); db.commit(); return {"ok": True}

# --- Assignments ---
@app.get("/assignments", response_model=List[schemas.Assignment])
def list_assignments(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(models.Assignment).all()

@app.post("/assignments", response_model=schemas.Assignment)
def create_assignment(a: schemas.AssignmentCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = models.Assignment(**a.dict()); db.add(m); db.commit(); db.refresh(m); return m

@app.delete("/assignments/{aid}")
def delete_assignment(aid: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = db.query(models.Assignment).get(aid)
    if not m: raise HTTPException(404, "Not found")
    db.delete(m); db.commit(); return {"ok": True}

# --- Daily Log ---
@app.get("/daily-log", response_model=List[schemas.DailyLog])
def list_daily_log(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(models.DailyLog).all()

@app.post("/daily-log", response_model=schemas.DailyLog)
def create_daily_log(d: schemas.DailyLogCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = models.DailyLog(**d.dict()); db.add(m); db.commit(); db.refresh(m); return m

# --- Readiness ---
@app.get("/readiness", response_model=List[schemas.Readiness])
def list_readiness(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(models.Readiness).all()

@app.post("/readiness", response_model=schemas.Readiness)
def create_readiness(r: schemas.ReadinessCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = models.Readiness(**r.dict()); db.add(m); db.commit(); db.refresh(m); return m
