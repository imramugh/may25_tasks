from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.api.v1 import auth, users, projects, tasks, settings as settings_router, ai_chat

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Task Management API",
    description="Backend API for task management with AI planning features",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with v1 prefix
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])
app.include_router(settings_router.router, prefix="/api/v1/settings", tags=["settings"])
app.include_router(ai_chat.router, prefix="/api/v1/ai", tags=["ai"])

# Include routers without v1 prefix for frontend compatibility
app.include_router(auth.router, prefix="/api/auth", tags=["authentication-compat"])
app.include_router(users.router, prefix="/api/users", tags=["users-compat"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects-compat"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks-compat"])
app.include_router(settings_router.router, prefix="/api/settings", tags=["settings-compat"])
app.include_router(ai_chat.router, prefix="/api/ai", tags=["ai-compat"])


@app.get("/")
async def root():
    return {"message": "Task Management API", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}