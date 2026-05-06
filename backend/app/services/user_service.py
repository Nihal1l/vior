from sqlalchemy.orm import Session
from ..repositories.user_repository import UserRepository
from ..schemas.schemas import UserCreate, UserUpdate
from ..core.security import verify_password

class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def authenticate(self, email: str, password: str):
        user = self.repository.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def create_user(self, user_in: UserCreate):
        return self.repository.create(user_in)

    def get_user_by_email(self, email: str):
        return self.repository.get_by_email(email)

    def update_user_status(self, user_id: int, is_online: bool = None, is_available: bool = None):
        user = self.repository.get_by_id(user_id)
        if not user:
            return None
        update_data = {}
        if is_online is not None:
            update_data["is_online"] = is_online
        if is_available is not None:
            update_data["is_available"] = is_available
        
        return self.repository.update(user, UserUpdate(**update_data))

    def get_all_users(self):
        return self.repository.get_all()
