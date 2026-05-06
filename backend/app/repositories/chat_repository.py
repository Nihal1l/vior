from sqlalchemy.orm import Session
from ..models.models import Message, Conversation
from ..schemas.schemas import MessageCreate

class ChatRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_message(self, message_in: MessageCreate, sender_id: int):
        db_message = Message(
            **message_in.dict(),
            sender_id=sender_id
        )
        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)
        return db_message

    def get_messages_by_conversation(self, conversation_id: int):
        return self.db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.timestamp.asc()).all()

    def get_conversation_by_request(self, request_id: int):
        return self.db.query(Conversation).filter(Conversation.help_request_id == request_id).first()

    def get_all_active_conversations(self):
        return self.db.query(Conversation).all()
