from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import openai
from anthropic import Anthropic
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.settings import UserSettings
from app.models.ai_chat import AIConversation, AIMessage, AITaskSuggestion
from app.models.task import Task
from app.models.project import Project
from app.models.enums import Priority
from app.api.v1.settings import decrypt_api_key

router = APIRouter()


# Pydantic schemas
class ChatMessage(BaseModel):
    content: str
    conversation_id: Optional[int] = None


class TaskSuggestionCreate(BaseModel):
    title: str
    description: str
    priority: Priority
    estimated_duration: str
    project_id: Optional[int] = None


class TaskSuggestionResponse(BaseModel):
    id: int
    title: str
    description: str
    priority: Priority
    estimated_duration: str
    project_name: Optional[str]
    created_task_id: Optional[int]
    
    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime
    task_suggestions: List[TaskSuggestionResponse]
    
    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    id: int
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse]
    
    class Config:
        from_attributes = True


def get_ai_client(user_settings: UserSettings):
    """Get AI client based on user preferences"""
    if not user_settings.enable_ai_features:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="AI features are disabled in settings"
        )
    
    if user_settings.preferred_ai_provider == "openai":
        api_key = decrypt_api_key(user_settings.openai_api_key_encrypted)
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OpenAI API key not configured"
            )
        return openai.Client(api_key=api_key)
    else:
        api_key = decrypt_api_key(user_settings.anthropic_api_key_encrypted)
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Anthropic API key not configured"
            )
        return Anthropic(api_key=api_key)


@router.post("/chat", response_model=MessageResponse)
async def send_chat_message(
    message: ChatMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get user settings
    user_settings = db.query(UserSettings).filter(
        UserSettings.user_id == current_user.id
    ).first()
    
    if not user_settings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User settings not found"
        )
    
    # Get or create conversation
    if message.conversation_id:
        conversation = db.query(AIConversation).filter(
            AIConversation.id == message.conversation_id,
            AIConversation.user_id == current_user.id
        ).first()
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
    else:
        conversation = AIConversation(
            user_id=current_user.id,
            title="New Event Planning Session"
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # Save user message
    user_message = AIMessage(
        conversation_id=conversation.id,
        role="user",
        content=message.content
    )
    db.add(user_message)
    db.commit()
    
    # Get AI response
    try:
        ai_client = get_ai_client(user_settings)
        
        # Prepare conversation history
        messages = db.query(AIMessage).filter(
            AIMessage.conversation_id == conversation.id
        ).order_by(AIMessage.created_at).all()
        
        conversation_history = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]
        
        # Call AI API (simplified - in production, you'd parse the response for task suggestions)
        if user_settings.preferred_ai_provider == "openai":
            response = await ai_client.chat.completions.create(
                model="gpt-4",
                messages=conversation_history,
                temperature=0.7
            )
            ai_response_content = response.choices[0].message.content
        else:
            response = await ai_client.messages.create(
                model="claude-3-opus-20240229",
                messages=conversation_history,
                max_tokens=1000
            )
            ai_response_content = response.content[0].text
        
        # Save AI response
        ai_message = AIMessage(
            conversation_id=conversation.id,
            role="assistant",
            content=ai_response_content
        )
        db.add(ai_message)
        db.commit()
        db.refresh(ai_message)
        
        # Parse for task suggestions (simplified - in production, use proper NLP)
        # For now, return empty suggestions
        task_suggestions = []
        
        # Format response
        return MessageResponse(
            id=ai_message.id,
            role=ai_message.role,
            content=ai_message.content,
            created_at=ai_message.created_at,
            task_suggestions=task_suggestions
        )
        
    except Exception as e:
        # Save error message
        error_message = AIMessage(
            conversation_id=conversation.id,
            role="assistant",
            content=f"I apologize, but I encountered an error: {str(e)}. Please check your API settings and try again."
        )
        db.add(error_message)
        db.commit()
        db.refresh(error_message)
        
        return MessageResponse(
            id=error_message.id,
            role=error_message.role,
            content=error_message.content,
            created_at=error_message.created_at,
            task_suggestions=[]
        )


@router.get("/conversations", response_model=List[ConversationResponse])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversations = db.query(AIConversation).filter(
        AIConversation.user_id == current_user.id
    ).order_by(AIConversation.updated_at.desc()).all()
    
    return conversations


@router.post("/suggestions/{suggestion_id}/create-task", response_model=dict)
def create_task_from_suggestion(
    suggestion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get suggestion
    suggestion = db.query(AITaskSuggestion).filter(
        AITaskSuggestion.id == suggestion_id
    ).first()
    
    if not suggestion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task suggestion not found"
        )
    
    # Verify user owns the conversation
    conversation = suggestion.message.conversation
    if conversation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create task from this suggestion"
        )
    
    # Check if task already created
    if suggestion.created_task_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task already created from this suggestion"
        )
    
    # Create task
    task = Task(
        title=suggestion.title,
        description=suggestion.description,
        priority=suggestion.priority,
        created_by_id=current_user.id,
        assignee_id=current_user.id,
        is_inbox=True  # Default to inbox
    )
    
    db.add(task)
    db.commit()
    db.refresh(task)
    
    # Update suggestion
    suggestion.created_task_id = task.id
    db.commit()
    
    return {
        "message": "Task created successfully",
        "task_id": task.id
    }