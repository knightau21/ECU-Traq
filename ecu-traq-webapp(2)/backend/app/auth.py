
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .database import get_db
from . import models
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET = os.getenv("JWT_SECRET", "change_me_now")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60*8

class TokenData(BaseModel):
    email: str | None = None

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

def verify_password(plain, hashed): return pwd_context.verify(plain, hashed)
def get_password_hash(p): return pwd_context.hash(p)

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> models.User:
    cred_err = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None: raise cred_err
    except JWTError:
        raise cred_err
    user = db.query(models.User).filter(models.User.email==email).first()
    if not user: raise cred_err
    return user
