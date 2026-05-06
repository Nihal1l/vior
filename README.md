# HelpSync - Real-time Help Connector

HelpSync is a premium, real-time web application designed to connect people in need (Clients) with people willing to help (Volunteers). It features a secure authentication system, role-based dashboards, and a real-time messaging system powered by WebSockets.

## 🚀 Features

### 🔐 Secure Authentication
- JWT-based authentication system.
- Distinct roles: **Admin**, **Volunteer**, and **Client**.
- Real-time online/offline status tracking.

### 📋 Help Request Management
- **Clients**: Create help requests with titles and descriptions.
- **Volunteers**: Browse pending requests and accept them to start helping.
- **Status Tracking**: Monitor requests from pending to accepted and completed.

### 💬 Real-time Messaging
- Instant one-to-one chat using WebSockets.
- Message history persistence in SQLite.
- Premium chat UI with glassmorphism and smooth animations.

### 🛡️ Admin Dashboard
- Oversight of all users and active conversations (Extensible).

---

## 🛠️ Tech Stack

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Frontend**: [React.js](https://reactjs.org/) (Vite)
- **Database**: SQLite (SQLAlchemy ORM)
- **Real-time**: WebSockets (Native FastAPI)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Premium Glassmorphism Design)

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd vior
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📖 Usage Guide

1. **Register**: Sign up as a **Client** or **Volunteer**.
2. **Client Flow**: 
   - Log in and click **"New Request"**.
   - Fill in your help request details.
   - Wait for a volunteer to accept.
3. **Volunteer Flow**:
   - Log in and browse **"Pending Requests"**.
   - Click **"Accept"** on a request you can help with.
4. **Chat**:
   - Once a request is accepted, both parties can click **"Chat"**.
   - Communicate in real-time to coordinate the help.

---

## 🏗️ Project Structure

```text
vior/
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── core/           # Config, Security, WS Manager
│   │   ├── models/         # SQLAlchemy Models
│   │   ├── schemas/        # Pydantic Schemas
│   │   ├── services/       # Business Logic
│   │   ├── routers/        # API Endpoints
│   │   └── main.py         # Entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── context/        # Auth & Chat Contexts
│   │   ├── pages/          # Login, Register, Dashboard, Chat
│   │   ├── components/     # Reusable UI components
│   │   └── App.jsx         # Main router
└── README.md
```

---

## 📄 License
This project is licensed under the MIT License.
