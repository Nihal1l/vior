from sqlalchemy.orm import Session
from ..repositories.request_repository import RequestRepository
from ..schemas.schemas import HelpRequestCreate
from ..models.models import RequestStatus

class RequestService:
    def __init__(self, db: Session):
        self.repository = RequestRepository(db)

    def create_request(self, request_in: HelpRequestCreate, client_id: int):
        return self.repository.create(request_in, client_id)

    def get_pending_requests(self):
        return self.repository.get_all_pending()

    def accept_request(self, request_id: int, volunteer_id: int):
        return self.repository.update_status(request_id, RequestStatus.ACCEPTED, volunteer_id)

    def reject_request(self, request_id: int):
        return self.repository.update_status(request_id, RequestStatus.REJECTED)

    def complete_request(self, request_id: int):
        return self.repository.update_status(request_id, RequestStatus.COMPLETED)

    def get_user_requests(self, user_id: int, role: str):
        if role == "client":
            return self.repository.get_by_client(user_id)
        else:
            return self.repository.get_by_volunteer(user_id)
