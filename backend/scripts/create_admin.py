import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import User, db
from passlib.hash import pbkdf2_sha256
from app import app  # Import the Flask app

def create_admin():
    """Create an admin user for testing."""
    admin_email = "admin@optimad.com"
    admin_password = "admin123"

    # Set up the application context
    with app.app_context():
        # Check if admin already exists
        existing_admin = User.query.filter_by(email=admin_email).first()
        if existing_admin:
            print("Admin already exists.")
            return

        # Create admin
        admin = User(
            email=admin_email,
            first_name="Admin",
            last_name="User",
            role="admin",  # Assign admin role
            subscription_status="active"
        )
        admin.set_password(admin_password)

        # Save to database
        db.session.add(admin)
        db.session.commit()
        print("Admin created successfully.")

# Run the script
if __name__ == "__main__":
    create_admin()