from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    VOLUNTEER = "volunteer"
    CLIENT = "client"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.CLIENT)
    is_active = Column(Boolean, default=True)
    is_online = Column(Boolean, default=False)
    
    # For volunteers
    is_available = Column(Boolean, default=True)
    
    # Relationships
    help_requests = relationship("HelpRequest", back_populates="client", foreign_keys="HelpRequest.client_id")
    assigned_requests = relationship("HelpRequest", back_populates="volunteer", foreign_keys="HelpRequest.volunteer_id")
    messages_sent = relationship("Message", back_populates="sender")

class RequestStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COMPLETED = "completed"

class HelpRequest(Base):
    __tablename__ = "help_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    client_id = Column(Integer, ForeignKey("users.id"))
    volunteer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    client = relationship("User", back_populates="help_requests", foreign_keys=[client_id])
    volunteer = relationship("User", back_populates="assigned_requests", foreign_keys=[volunteer_id])
    conversation = relationship("Conversation", back_populates="help_request", uselist=False)

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    help_request_id = Column(Integer, ForeignKey("help_requests.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    help_request = relationship("HelpRequest", back_populates="conversation")
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)
    
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", back_populates="messages_sent")
