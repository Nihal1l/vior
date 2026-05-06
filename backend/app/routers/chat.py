from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from ..database import get_db
from ..core.ws_manager import manager
from ..services.chat_service import ChatService
from ..services.user_service import UserService
from ..schemas.schemas import MessageCreate, MessageOut, ConversationOut
from ..core.security import jwt
from ..core.config import settings

router = APIRouter(prefix="/chat", tags=["chat"])

async def get_token_user(db: Session, token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if email is None:
            return None
        user_service = UserService(db)
        return user_service.get_user_by_email(email)
    except:
        return None

@router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str, db: Session = Depends(get_db)):
    user = await get_token_user(db, token)
    if not user:
        await websocket.close(code=1008)
        return

    await manager.mystery_connect(websocket, user.id)
    chat_service = ChatService(db)
    user_service = UserService(db)
    
    # Set user online
    user_service.update_user_status(user.id, is_online=True)
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Message format: {"type": "chat", "conversation_id": 1, "content": "hello", "recipient_id": 2}
            if message_data.get("type") == "chat":
                msg_in = MessageCreate(
                    conversation_id=message_data["conversation_id"],
                    content=message_data["content"]
                )
                db_msg = chat_service.send_message(msg_in, user.id)
                
                # Notify recipient
                recipient_id = message_data.get("recipient_id")
                payload = {
                    "type": "message",
                    "data": {
                        "id": db_msg.id,
                        "conversation_id": db_msg.conversation_id,
                        "sender_id": db_msg.sender_id,
                        "content": db_msg.content,
                        "timestamp": str(db_msg.timestamp)
                    }
                }
                if recipient_id:
                    await manager.send_personal_message(payload, recipient_id)
                
                # Send confirmation back to sender
                await manager.send_personal_message(payload, user.id)

    except WebSocketDisconnect:
        manager.disconnect(user.id)
        user_service.update_user_status(user.id, is_online=False)

@router.get("/history-by-request/{request_id}", response_model=ConversationOut)
def get_by_request(request_id: int, db: Session = Depends(get_db)):
    service = ChatService(db)
    conv = service.get_conversation_by_request(request_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv

@router.get("/history/{conversation_id}", response_model=List[MessageOut])
def get_history(conversation_id: int, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.get_conversation_history(conversation_id)
