from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.schemas import HelpRequestCreate, HelpRequestOut, UserOut
from ..services.request_service import RequestService
from ..services.user_service import UserService
from ..core.security import jwt
from ..core.config import settings
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/requests", tags=["requests"])
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_service = UserService(db)
    user = user_service.get_user_by_email(email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=HelpRequestOut)
def create_request(request_in: HelpRequestCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = RequestService(db)
    return service.create_request(request_in, current_user.id)

@router.get("/pending", response_model=List[HelpRequestOut])
def get_pending(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = RequestService(db)
    return service.get_pending_requests()

@router.post("/{request_id}/accept", response_model=HelpRequestOut)
def accept_request(request_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers can accept requests")
    service = RequestService(db)
    return service.accept_request(request_id, current_user.id)

@router.get("/my", response_model=List[HelpRequestOut])
def get_my_requests(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = RequestService(db)
    return service.get_user_requests(current_user.id, current_user.role)
