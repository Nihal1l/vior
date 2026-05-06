from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from ..models.models import UserRole, RequestStatus

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    is_available: Optional[bool] = None
    is_online: Optional[bool] = None

class UserOut(UserBase):
    id: int
    is_active: bool
    is_online: bool
    is_available: bool

    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Message Schemas
class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    conversation_id: int

class MessageOut(MessageBase):
    id: int
    sender_id: int
    timestamp: datetime
    is_read: bool

    class Config:
        from_attributes = True

# Conversation Schemas
class ConversationOut(BaseModel):
    id: int
    help_request_id: int
    messages: List[MessageOut] = []

    class Config:
        from_attributes = True

# Help Request Schemas
class HelpRequestBase(BaseModel):
    title: str
    description: Optional[str] = None

class HelpRequestCreate(HelpRequestBase):
    pass

class HelpRequestOut(HelpRequestBase):
    id: int
    status: RequestStatus
    created_at: datetime
    client_id: int
    volunteer_id: Optional[int] = None
    client: UserOut
    volunteer: Optional[UserOut] = None

    class Config:
        from_attributes = True
