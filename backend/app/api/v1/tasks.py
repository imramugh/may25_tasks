from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.task import Task, Tag
from app.models.project import Project, ProjectMember
from app.models.enums import Priority, TaskStatus

router = APIRouter()


# Pydantic schemas
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[Priority] = Priority.MEDIUM
    due_date: Optional[str] = None
    project_id: Optional[int] = None
    assignee_id: Optional[int] = None
    tags: Optional[List[str]] = []
    is_inbox: Optional[bool] = True


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    due_date: Optional[str] = None
    status: Optional[TaskStatus] = None
    project_id: Optional[int] = None
    assignee_id: Optional[int] = None
    is_inbox: Optional[bool] = None


class BulkTaskUpdate(BaseModel):
    task_ids: List[int]
    status: Optional[TaskStatus] = None
    priority: Optional[Priority] = None
    project_id: Optional[int] = None
    assignee_id: Optional[int] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    priority: Priority
    due_date: Optional[date]
    status: TaskStatus
    project_id: Optional[int]
    project_name: Optional[str]
    assignee_id: Optional[int]
    assignee_name: Optional[str]
    created_by_id: int
    is_inbox: bool
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    project_id: Optional[int] = Query(None),
    status: Optional[TaskStatus] = Query(None),
    priority: Optional[Priority] = Query(None),
    inbox_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Base query - get tasks where user is assignee or creator
    query = db.query(Task).filter(
        (Task.assignee_id == current_user.id) | 
        (Task.created_by_id == current_user.id)
    )
    
    # Apply filters
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if inbox_only:
        query = query.filter(Task.is_inbox == True)
    
    # Also include tasks from projects where user is a member
    project_tasks = db.query(Task).join(Project).join(ProjectMember).filter(
        ProjectMember.user_id == current_user.id
    )
    
    # Combine queries and remove duplicates
    all_tasks = list({t.id: t for t in query.all() + project_tasks.all()}.values())
    
    # Update overdue tasks
    today = date.today()
    for task in all_tasks:
        if task.due_date and task.due_date < today and task.status != TaskStatus.COMPLETED:
            task.status = TaskStatus.OVERDUE
            db.commit()
    
    # Format response
    response_tasks = []
    for task in all_tasks:
        response_task = TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            priority=task.priority,
            due_date=task.due_date,
            status=task.status,
            project_id=task.project_id,
            project_name=task.project.name if task.project else None,
            assignee_id=task.assignee_id,
            assignee_name=task.assignee.name if task.assignee else None,
            created_by_id=task.created_by_id,
            is_inbox=task.is_inbox,
            tags=[tag.name for tag in task.tags],
            created_at=task.created_at,
            updated_at=task.updated_at,
            completed_at=task.completed_at
        )
        response_tasks.append(response_task)
    
    return response_tasks


@router.post("/", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # If project_id is provided, verify user has access
    if task_data.project_id:
        project = db.query(Project).filter(Project.id == task_data.project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        is_member = db.query(ProjectMember).filter(
            ProjectMember.project_id == task_data.project_id,
            ProjectMember.user_id == current_user.id
        ).first()
        
        if project.owner_id != current_user.id and not is_member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create tasks in this project"
            )
        
        task_data.is_inbox = False
    
    # Create task
    db_task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=datetime.strptime(task_data.due_date, "%Y-%m-%d").date() if task_data.due_date else None,
        project_id=task_data.project_id,
        assignee_id=task_data.assignee_id or current_user.id,
        created_by_id=current_user.id,
        is_inbox=task_data.is_inbox
    )
    
    # Handle tags
    for tag_name in task_data.tags:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.add(tag)
        db_task.tags.append(tag)
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    # Format response
    return TaskResponse(
        id=db_task.id,
        title=db_task.title,
        description=db_task.description,
        priority=db_task.priority,
        due_date=db_task.due_date,
        status=db_task.status,
        project_id=db_task.project_id,
        project_name=db_task.project.name if db_task.project else None,
        assignee_id=db_task.assignee_id,
        assignee_name=db_task.assignee.name if db_task.assignee else None,
        created_by_id=db_task.created_by_id,
        is_inbox=db_task.is_inbox,
        tags=[tag.name for tag in db_task.tags],
        created_at=db_task.created_at,
        updated_at=db_task.updated_at,
        completed_at=db_task.completed_at
    )


@router.put("/bulk", response_model=dict)
def bulk_update_tasks(
    bulk_update: BulkTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get tasks and verify access
    tasks = db.query(Task).filter(Task.id.in_(bulk_update.task_ids)).all()
    
    if len(tasks) != len(bulk_update.task_ids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Some tasks not found"
        )
    
    # Verify user has access to all tasks
    for task in tasks:
        has_access = (
            task.assignee_id == current_user.id or
            task.created_by_id == current_user.id
        )
        
        if task.project:
            is_member = db.query(ProjectMember).filter(
                ProjectMember.project_id == task.project_id,
                ProjectMember.user_id == current_user.id
            ).first()
            has_access = has_access or task.project.owner_id == current_user.id or is_member
        
        if not has_access:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Not authorized to update task {task.id}"
            )
    
    # Update tasks
    update_data = bulk_update.dict(exclude_unset=True, exclude={"task_ids"})
    for task in tasks:
        for field, value in update_data.items():
            if value is not None:
                setattr(task, field, value)
        
        if bulk_update.status == TaskStatus.COMPLETED:
            task.completed_at = datetime.utcnow()
        
        task.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {
        "message": f"Updated {len(tasks)} tasks successfully",
        "updated_count": len(tasks)
    }