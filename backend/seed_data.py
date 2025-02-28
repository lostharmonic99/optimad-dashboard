
from models import db, Subscription
import json
from models import User, db
from passlib.hash import pbkdf2_sha256

def seed_subscriptions():
    """Seed subscription plans if they don't exist"""
    # Check if subscriptions already exist
    if Subscription.query.count() > 0:
        return
    
    # Define subscription plans
    subscriptions = [
        {
            'name': 'Free',
            'price': 0.0,
            'duration_days': 0,
            'features': json.dumps([
                'Up to 3 campaigns',
                'Basic analytics',
                'Standard support'
            ]),
            'max_campaigns': 3,
            'is_active': True
        },
        {
            'name': 'Pro',
            'price': 29.99,
            'duration_days': 30,
            'features': json.dumps([
                'Up to 10 campaigns',
                'Advanced analytics',
                'Priority support',
                'Campaign recommendations'
            ]),
            'max_campaigns': 10,
            'is_active': True
        },
        {
            'name': 'Enterprise',
            'price': 99.99,
            'duration_days': 30,
            'features': json.dumps([
                'Unlimited campaigns',
                'Premium analytics',
                'Dedicated support',
                'AI-powered optimizations',
                'Custom integrations'
            ]),
            'max_campaigns': 100,
            'is_active': True
        }
    ]
    
    # Add subscription plans to database
    for sub_data in subscriptions:
        subscription = Subscription(**sub_data)
        db.session.add(subscription)
    
    db.session.commit()

def create_superuser():
    """Create a superuser during deployment."""
    superuser_email = "superuser@optimad.com"
    superuser_password = "superuser123"

    # Check if superuser already exists
    existing_superuser = User.query.filter_by(email=superuser_email).first()
    if existing_superuser:
        print("Superuser already exists.")
        return

    # Create superuser
    superuser = User(
        email=superuser_email,
        first_name="Super",
        last_name="User",
        role="superuser",  # Assign superuser role
        subscription_status="active"  # Default subscription
    )
    superuser.set_password(superuser_password)

    # Save to database
    db.session.add(superuser)
    db.session.commit()
    print("Superuser created successfully.")

# Run the script during deployment
create_superuser()