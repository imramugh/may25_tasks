#!/usr/bin/env python3
"""
Create test data for development.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from datetime import datetime, timedelta, date
from app.database import SessionLocal, engine, Base
from app.models import User, Project, Task, Tag, ProjectMember, UserSettings
from app.models.enums import ProjectStatus, TaskStatus, Priority
from app.api.v1.auth import get_password_hash


def create_test_data():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).count() > 0:
            print("Test data already exists. Skipping...")
            return
        
        print("Creating test users...")
        # Create test users
        users = [
            User(
                email="sarah.chen@example.com",
                name="Sarah Chen",
                hashed_password=get_password_hash("password123"),
                role="Project Manager",
                department="Product Development",
                last_login=datetime.utcnow()
            ),
            User(
                email="mike.johnson@example.com",
                name="Mike Johnson",
                hashed_password=get_password_hash("password123"),
                role="Developer",
                department="Engineering"
            ),
            User(
                email="alex.rivera@example.com",
                name="Alex Rivera",
                hashed_password=get_password_hash("password123"),
                role="Developer",
                department="Engineering"
            ),
            User(
                email="emma.davis@example.com",
                name="Emma Davis",
                hashed_password=get_password_hash("password123"),
                role="Designer",
                department="Design"
            ),
        ]
        
        for user in users:
            db.add(user)
        db.commit()
        
        # Create user settings
        for user in users:
            settings = UserSettings(user_id=user.id)
            db.add(settings)
        db.commit()
        
        print("Creating test projects...")
        # Create test projects
        projects = [
            Project(
                name="Website Redesign",
                description="Complete overhaul of the company website with modern design and improved UX",
                status=ProjectStatus.IN_PROGRESS,
                due_date=date.today() + timedelta(days=20),
                owner_id=users[0].id
            ),
            Project(
                name="Mobile App Development",
                description="Native iOS and Android app for customer engagement",
                status=ProjectStatus.PLANNING,
                due_date=date.today() + timedelta(days=90),
                owner_id=users[0].id
            ),
            Project(
                name="Security Updates",
                description="Implementation of enhanced security measures across all systems",
                status=ProjectStatus.IN_PROGRESS,
                due_date=date.today() + timedelta(days=10),
                owner_id=users[1].id
            ),
        ]
        
        for project in projects:
            db.add(project)
        db.commit()
        
        # Add project members
        for project in projects:
            # Add owner as member
            member = ProjectMember(project_id=project.id, user_id=project.owner_id)
            db.add(member)
            # Add some other members
            for user in users[1:3]:
                if user.id != project.owner_id:
                    member = ProjectMember(project_id=project.id, user_id=user.id)
                    db.add(member)
        db.commit()
        
        print("Creating test tags...")
        # Create tags
        tag_names = ["design", "ui/ux", "backend", "frontend", "security", "performance", "testing"]
        tags = []
        for name in tag_names:
            tag = Tag(name=name)
            db.add(tag)
            tags.append(tag)
        db.commit()
        
        print("Creating test tasks...")
        # Create test tasks
        tasks = [
            Task(
                title="Design new landing page mockups",
                description="Create wireframes and high-fidelity mockups for the new landing page",
                priority=Priority.HIGH,
                due_date=date.today() + timedelta(days=3),
                status=TaskStatus.IN_PROGRESS,
                project_id=projects[0].id,
                assignee_id=users[3].id,
                created_by_id=users[0].id
            ),
            Task(
                title="Update navigation structure",
                description="Redesign the main navigation for better UX",
                priority=Priority.MEDIUM,
                due_date=date.today() + timedelta(days=5),
                status=TaskStatus.OPEN,
                project_id=projects[0].id,
                assignee_id=users[1].id,
                created_by_id=users[0].id
            ),
            Task(
                title="Review API documentation",
                description="Go through the API docs and update any outdated information",
                priority=Priority.MEDIUM,
                due_date=date.today() + timedelta(days=7),
                status=TaskStatus.OPEN,
                assignee_id=users[1].id,
                created_by_id=users[1].id,
                is_inbox=True
            ),
            Task(
                title="Fix login security vulnerability",
                description="Patch the security issue found in the login system",
                priority=Priority.HIGH,
                due_date=date.today() - timedelta(days=2),
                status=TaskStatus.OVERDUE,
                project_id=projects[2].id,
                assignee_id=users[2].id,
                created_by_id=users[1].id
            ),
        ]
        
        for task in tasks:
            db.add(task)
        db.commit()
        
        # Add tags to tasks
        tasks[0].tags.extend([tags[0], tags[1]])  # design, ui/ux
        tasks[1].tags.append(tags[3])  # frontend
        tasks[2].tags.append(tags[2])  # backend
        tasks[3].tags.extend([tags[4], tags[2]])  # security, backend
        db.commit()
        
        print("\nTest data created successfully!")
        print("\nTest users:")
        for user in users:
            print(f"  - {user.email} (password: password123)")
        
    finally:
        db.close()


if __name__ == "__main__":
    create_test_data()