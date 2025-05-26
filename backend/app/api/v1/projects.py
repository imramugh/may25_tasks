from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.project import Project, ProjectMember
from app.models.task import Task
from app.models.enums import ProjectStatus, TaskStatus

router = APIRouter()


# Pydantic schemas
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[ProjectStatus] = ProjectStatus.PLANNING


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    due_date: Optional[str] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: ProjectStatus
    progress: int
    due_date: Optional[date]
    owner_id: int
    total_tasks: int
    completed_tasks: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get projects where user is owner or member
    owned_projects = db.query(Project).filter(Project.owner_id == current_user.id).all()
    member_projects = db.query(Project).join(ProjectMember).filter(
        ProjectMember.user_id == current_user.id
    ).all()
    
    # Combine and remove duplicates
    all_projects = list({p.id: p for p in owned_projects + member_projects}.values())
    
    # Calculate progress for each project
    for project in all_projects:
        total_tasks = db.query(Task).filter(Task.project_id == project.id).count()
        completed_tasks = db.query(Task).filter(
            Task.project_id == project.id,
            Task.status == TaskStatus.COMPLETED
        ).count()
        
        project.total_tasks = total_tasks
        project.completed_tasks = completed_tasks
        project.progress = int((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0)
    
    return all_projects


@router.post("/", response_model=ProjectResponse)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Create new project
    db_project = Project(
        name=project_data.name,
        description=project_data.description,
        status=project_data.status,
        due_date=datetime.strptime(project_data.due_date, "%Y-%m-%d").date() if project_data.due_date else None,
        owner_id=current_user.id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Add owner as a member
    project_member = ProjectMember(
        project_id=db_project.id,
        user_id=current_user.id
    )
    db.add(project_member)
    db.commit()
    
    db_project.total_tasks = 0
    db_project.completed_tasks = 0
    
    return db_project


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user has access to this project
    is_member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    
    if project.owner_id != current_user.id and not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this project"
        )
    
    # Calculate progress
    total_tasks = db.query(Task).filter(Task.project_id == project.id).count()
    completed_tasks = db.query(Task).filter(
        Task.project_id == project.id,
        Task.status == TaskStatus.COMPLETED
    ).count()
    
    project.total_tasks = total_tasks
    project.completed_tasks = completed_tasks
    project.progress = int((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0)
    
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Only owner can update project
    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only project owner can update project"
        )
    
    # Update project fields
    update_data = project_update.dict(exclude_unset=True)
    if "due_date" in update_data and update_data["due_date"]:
        update_data["due_date"] = datetime.strptime(update_data["due_date"], "%Y-%m-%d").date()
    
    for field, value in update_data.items():
        setattr(project, field, value)
    
    project.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(project)
    
    # Calculate progress
    total_tasks = db.query(Task).filter(Task.project_id == project.id).count()
    completed_tasks = db.query(Task).filter(
        Task.project_id == project.id,
        Task.status == TaskStatus.COMPLETED
    ).count()
    
    project.total_tasks = total_tasks
    project.completed_tasks = completed_tasks
    project.progress = int((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0)
    
    return project