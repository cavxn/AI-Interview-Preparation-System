#!/usr/bin/env python3
"""
Database migration script to add Google ID support to existing users.
This script adds the google_id column to the users table and makes hashed_password optional.
"""

import sqlite3
import os
from pathlib import Path

def migrate_database():
    """Add Google ID column to users table"""
    
    # Find the database file
    db_path = Path(__file__).parent / "app.db"
    if not db_path.exists():
        print("❌ Database file not found. Please run the backend first to create the database.")
        return False
    
    try:
        # Connect to the database
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        print("🔄 Starting database migration...")
        
        # Check if google_id column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'google_id' in columns:
            print("✅ google_id column already exists. Migration not needed.")
            return True
        
        # Add google_id column (without UNIQUE constraint first)
        print("📝 Adding google_id column...")
        cursor.execute("ALTER TABLE users ADD COLUMN google_id VARCHAR")
        
        # Make hashed_password nullable by recreating the table
        print("📝 Making hashed_password nullable...")
        
        # Get current table structure
        cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'")
        table_sql = cursor.fetchone()[0]
        
        # Create new table with nullable hashed_password and google_id
        new_table_sql = table_sql.replace(
            "hashed_password VARCHAR NOT NULL",
            "hashed_password VARCHAR"
        ).replace(
            "CREATE TABLE users",
            "CREATE TABLE users_new"
        )
        
        # Create new table
        cursor.execute(new_table_sql)
        cursor.execute("INSERT INTO users_new SELECT * FROM users")
        cursor.execute("DROP TABLE users")
        cursor.execute("ALTER TABLE users_new RENAME TO users")
        
        # Create indexes
        cursor.execute("CREATE UNIQUE INDEX ix_users_email ON users (email)")
        cursor.execute("CREATE UNIQUE INDEX ix_users_google_id ON users (google_id)")
        
        conn.commit()
        print("✅ Database migration completed successfully!")
        
        # Show updated table structure
        cursor.execute("PRAGMA table_info(users)")
        columns = cursor.fetchall()
        print("\n📋 Updated users table structure:")
        for column in columns:
            print(f"  - {column[1]} ({column[2]}) {'NOT NULL' if column[3] else 'NULL'}")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    success = migrate_database()
    if success:
        print("\n🎉 Migration completed! You can now use Google login.")
    else:
        print("\n💥 Migration failed. Please check the error messages above.")
