from sqlalchemy.orm import Session
from ..models.models import HelpRequest, RequestStatus, Conversation
from ..schemas.schemas import HelpRequestCreate

class RequestRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, request_in: HelpRequestCreate, client_id: int):
        db_request = HelpRequest(
            **request_in.dict(),
            client_id=client_id,
            status=RequestStatus.PENDING
        )
        self.db.add(db_request)
        self.db.commit()
        self.db.refresh(db_request)
        return db_request

    def get_all_pending(self):
        return self.db.query(HelpRequest).filter(HelpRequest.status == RequestStatus.PENDING).all()

    def get_by_id(self, request_id: int):
        return self.db.query(HelpRequest).filter(HelpRequest.id == request_id).first()

    def update_status(self, request_id: int, status: RequestStatus, volunteer_id: int = None):
        db_request = self.get_by_id(request_id)
        if db_request:
            db_request.status = status
            if volunteer_id:
                db_request.volunteer_id = volunteer_id
            
            # If accepted, create a conversation
            if status == RequestStatus.ACCEPTED and not db_request.conversation:
                conversation = Conversation(help_request_id=request_id)
                self.db.add(conversation)
            
            self.db.commit()
            self.db.refresh(db_request)
        return db_request

    def get_by_client(self, client_id: int):
        return self.db.query(HelpRequest).filter(HelpRequest.client_id == client_id).all()

    def get_by_volunteer(self, volunteer_id: int):
        return self.db.query(HelpRequest).filter(HelpRequest.volunteer_id == volunteer_id).all()
