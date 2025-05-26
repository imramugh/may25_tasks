from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL_SQLITE: str = "sqlite:///./app.db"
    DATABASE_URL_POSTGRES: Optional[str] = None
    
    # API
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Encryption
    ENCRYPTION_KEY: str
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    @property
    def database_url(self) -> str:
        if self.ENVIRONMENT == "production" and self.DATABASE_URL_POSTGRES:
            return self.DATABASE_URL_POSTGRES
        return self.DATABASE_URL_SQLITE
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()