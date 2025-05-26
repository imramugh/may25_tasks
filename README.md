# Task Management Application

A modern task management application with AI-powered planning features, built with Next.js (frontend) and FastAPI (backend).

## Features

- 📋 Task Management with Projects and Inbox
- 🤖 AI-powered Event Planning Assistant
- 👤 User Profiles and Settings
- 🔐 Secure Authentication
- 🎨 Modern, Responsive UI
- 🔌 Support for OpenAI and Anthropic APIs

## Project Structure

```
.
├── frontend/          # Next.js frontend application
│   └── src/
│       ├── app/      # App router pages
│       ├── components/ # Reusable UI components
│       └── data/     # Mock data (to be replaced with API calls)
│
└── backend/          # FastAPI backend application
    ├── app/
    │   ├── api/      # API endpoints
    │   ├── models/   # SQLAlchemy models
    │   ├── schemas/  # Pydantic schemas
    │   ├── crud/     # Database operations
    │   └── core/     # Core functionality
    └── alembic/      # Database migrations
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL (for production) or SQLite (for development)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Initialize the database:
   ```bash
   python init_alembic.py
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

6. (Optional) Create test data:
   ```bash
   python scripts/create_test_data.py
   ```

7. Start the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   The API will be available at http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs
   - ReDoc: http://localhost:8000/api/redoc

### Using Docker (Alternative)

For backend development with PostgreSQL:

```bash
cd backend
docker-compose up
```

## Development Workflow

1. Backend API is available at http://localhost:8000
2. Frontend is available at http://localhost:3000
3. Update frontend API calls to point to the backend
4. Use the test accounts created by the script:
   - sarah.chen@example.com (password: password123)
   - mike.johnson@example.com (password: password123)
   - alex.rivera@example.com (password: password123)
   - emma.davis@example.com (password: password123)

## Next Steps

1. **Update Frontend API Calls**: Replace the mock data in `frontend/src/data/` with actual API calls to the backend
2. **Implement Remaining CRUD Operations**: Add update and delete endpoints for tasks and projects
3. **Add Real AI Integration**: Implement actual AI parsing for task suggestions in the AI chat
4. **Add Tests**: Write unit and integration tests for both frontend and backend
5. **Set Up CI/CD**: Configure GitHub Actions for automated testing and deployment
6. **Add WebSocket Support**: For real-time updates and notifications
7. **Implement File Uploads**: For user avatars and attachments

## License

This project is licensed under the MIT License.