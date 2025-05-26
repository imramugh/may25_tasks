#!/usr/bin/env python3
"""
Initialize Alembic for database migrations.
Run this script after setting up your environment.
"""

import os
import subprocess
import sys


def main():
    # Check if alembic directory already exists
    if os.path.exists("alembic"):
        print("Alembic directory already exists. Skipping initialization.")
        return
    
    # Initialize alembic
    print("Initializing Alembic...")
    subprocess.run([sys.executable, "-m", "alembic", "init", "alembic"], check=True)
    
    # Update alembic.ini
    print("Updating alembic.ini...")
    with open("alembic.ini", "r") as f:
        content = f.read()
    
    # Replace the sqlalchemy.url line
    content = content.replace(
        "sqlalchemy.url = driver://user:pass@localhost/dbname",
        "# sqlalchemy.url is set programmatically in env.py"
    )
    
    with open("alembic.ini", "w") as f:
        f.write(content)
    
    # Update alembic/env.py
    print("Updating alembic/env.py...")
    env_py_content = '''from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.database import Base
from app.config import settings
from app.models import *  # Import all models

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the database URL from settings
config.set_main_option("sqlalchemy.url", settings.database_url)

# Add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
'''
    
    with open("alembic/env.py", "w") as f:
        f.write(env_py_content)
    
    print("\nAlembic initialization complete!")
    print("\nNext steps:")
    print("1. Make sure your .env file is configured")
    print("2. Run: alembic revision --autogenerate -m 'Initial migration'")
    print("3. Run: alembic upgrade head")


if __name__ == "__main__":
    main()