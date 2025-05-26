from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Display preferences
    text_size = Column(String, default="normal")
    date_format = Column(String, default="MM/DD/YYYY")
    time_format = Column(String, default="12")
    
    # API Keys (encrypted)
    openai_api_key_encrypted = Column(String, nullable=True)
    anthropic_api_key_encrypted = Column(String, nullable=True)
    
    # AI preferences
    enable_ai_features = Column(Boolean, default=True)
    preferred_ai_provider = Column(String, default="openai")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="settings")