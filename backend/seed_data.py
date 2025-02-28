
from models import db, Subscription
import json

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
