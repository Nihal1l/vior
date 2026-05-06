from sqlalchemy.orm import Session
from ..repositories.chat_repository import ChatRepository
from ..schemas.schemas import MessageCreate

class ChatService:
    def __init__(self, db: Session):
        self.repository = ChatRepository(db)

    def send_message(self, message_in: MessageCreate, sender_id: int):
        return self.repository.create_message(message_in, sender_id)

    def get_conversation_history(self, conversation_id: int):
        return self.repository.get_messages_by_conversation(conversation_id)

    def get_conversation_by_request(self, request_id: int):
        return self.repository.get_conversation_by_request(request_id)
