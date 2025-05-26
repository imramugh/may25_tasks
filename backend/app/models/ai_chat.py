from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
from app.models.enums import Priority


class AIConversation(Base):
    __tablename__ = "ai_conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="ai_conversations")
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")


class AIMessage(Base):
    __tablename__ = "ai_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("ai_conversations.id"))
    role = Column(String)  # "user" or "assistant"
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversation = relationship("AIConversation", back_populates="messages")
    task_suggestions = relationship("AITaskSuggestion", back_populates="message", cascade="all, delete-orphan")


class AITaskSuggestion(Base):
    __tablename__ = "ai_task_suggestions"
    
    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(Integer, ForeignKey("ai_messages.id"))
    title = Column(String)
    description = Column(Text)
    priority = Column(Enum(Priority))
    estimated_duration = Column(String)
    project_name = Column(String, nullable=True)
    created_task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    
    # Relationships
    message = relationship("AIMessage", back_populates="task_suggestions")
    created_task = relationship("Task")