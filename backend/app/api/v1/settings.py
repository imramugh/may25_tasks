from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from cryptography.fernet import Fernet
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.settings import UserSettings
from app.config import settings as app_settings

router = APIRouter()

# Initialize encryption
fernet = Fernet(app_settings.ENCRYPTION_KEY.encode()[:32].ljust(32, b'0'))


# Pydantic schemas
class SettingsUpdate(BaseModel):
    text_size: Optional[str] = None
    date_format: Optional[str] = None
    time_format: Optional[str] = None
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    enable_ai_features: Optional[bool] = None
    preferred_ai_provider: Optional[str] = None


class SettingsResponse(BaseModel):
    text_size: str
    date_format: str
    time_format: str
    enable_ai_features: bool
    preferred_ai_provider: str
    has_openai_key: bool
    has_anthropic_key: bool
    
    class Config:
        from_attributes = True


def encrypt_api_key(api_key: str) -> str:
    """Encrypt an API key"""
    if not api_key:
        return None
    return fernet.encrypt(api_key.encode()).decode()


def decrypt_api_key(encrypted_key: str) -> str:
    """Decrypt an API key"""
    if not encrypted_key:
        return None
    try:
        return fernet.decrypt(encrypted_key.encode()).decode()
    except:
        return None


@router.get("/", response_model=SettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(UserSettings).filter(
        UserSettings.user_id == current_user.id
    ).first()
    
    if not settings:
        # Create default settings
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return {
        "text_size": settings.text_size,
        "date_format": settings.date_format,
        "time_format": settings.time_format,
        "enable_ai_features": settings.enable_ai_features,
        "preferred_ai_provider": settings.preferred_ai_provider,
        "has_openai_key": bool(settings.openai_api_key_encrypted),
        "has_anthropic_key": bool(settings.anthropic_api_key_encrypted)
    }


@router.put("/", response_model=SettingsResponse)
def update_settings(
    settings_update: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(UserSettings).filter(
        UserSettings.user_id == current_user.id
    ).first()
    
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
    
    # Update settings
    update_data = settings_update.dict(exclude_unset=True)
    
    # Handle API keys encryption
    if "openai_api_key" in update_data:
        api_key = update_data.pop("openai_api_key")
        if api_key:  # Only encrypt if not empty
            settings.openai_api_key_encrypted = encrypt_api_key(api_key)
        else:
            settings.openai_api_key_encrypted = None
    
    if "anthropic_api_key" in update_data:
        api_key = update_data.pop("anthropic_api_key")
        if api_key:  # Only encrypt if not empty
            settings.anthropic_api_key_encrypted = encrypt_api_key(api_key)
        else:
            settings.anthropic_api_key_encrypted = None
    
    # Update other fields
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    
    return {
        "text_size": settings.text_size,
        "date_format": settings.date_format,
        "time_format": settings.time_format,
        "enable_ai_features": settings.enable_ai_features,
        "preferred_ai_provider": settings.preferred_ai_provider,
        "has_openai_key": bool(settings.openai_api_key_encrypted),
        "has_anthropic_key": bool(settings.anthropic_api_key_encrypted)
    }