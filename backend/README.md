# Task Management Backend

FastAPI backend for the task management application with AI planning features.

## Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run migrations:**
   ```bash
   alembic init alembic
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

5. **Start the server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## API Documentation

- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Database

- **Development**: SQLite (automatically created as `app.db`)
- **Production**: PostgreSQL (configure in `.env`)

## Project Structure

```
app/
├── api/          # API endpoints
├── models/       # SQLAlchemy models
├── schemas/      # Pydantic schemas
├── crud/         # Database operations
├── core/         # Core functionality (auth, security, etc.)
└── tests/        # Test files
```

## Testing

```bash
pytest
```

## Docker Support

Coming soon...
