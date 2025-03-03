
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from passlib.hash import pbkdf2_sha256

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=True)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Social auth fields
    google_id = db.Column(db.String(120), unique=True, nullable=True)
    facebook_id = db.Column(db.String(120), unique=True, nullable=True)
    
    # RBAC fields
    role = db.Column(db.String(20), default='user')  # 'admin', 'user', 'guest'
    
    # Subscription fields
    subscription_id = db.Column(db.Integer, db.ForeignKey('subscriptions.id'), nullable=True)
    subscription_status = db.Column(db.String(20), default='free')  # 'free', 'active', 'canceled', 'expired'
    subscription_end_date = db.Column(db.DateTime, nullable=True)
    
    # Relationship with campaigns
    campaigns = db.relationship('Campaign', backref='user', lazy=True)
    refresh_tokens = db.relationship('RefreshToken', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = pbkdf2_sha256.hash(password)
        
    def check_password(self, password):
        if self.password_hash:
            return pbkdf2_sha256.verify(password, self.password_hash)
        return False
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'role': self.role,
            'subscriptionStatus': self.subscription_status,
            'subscriptionEndDate': self.subscription_end_date.isoformat() if self.subscription_end_date else None,
            'createdAt': self.created_at.isoformat()
        }
    
    def has_permission(self, permission):
        if self.role == 'admin':
            return True
        
        permissions = {
            'user': ['view_own_campaigns', 'create_campaign', 'edit_own_campaign', 'delete_own_campaign'],
            'guest': ['view_own_campaigns']
        }
        
        return permission in permissions.get(self.role, [])

class RefreshToken(db.Model):
    __tablename__ = 'refresh_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False)  # JWT ID (jti)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def is_valid(self):
        """Check if the refresh token is still valid."""
        return datetime.utcnow() < self.expires_at

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    duration_days = db.Column(db.Integer, nullable=False)  # Duration in days
    features = db.Column(db.String(500), nullable=False)  # JSON string of features
    max_campaigns = db.Column(db.Integer, nullable=False, default=5)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationship with users
    users = db.relationship('User', backref='subscription', lazy=True)
    
    def to_dict(self):
        import json
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'duration_days': self.duration_days,
            'features': json.loads(self.features) if self.features else [],
            'max_campaigns': self.max_campaigns,
            'is_active': self.is_active
        }

class Campaign(db.Model):
    __tablename__ = 'campaigns'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    objective = db.Column(db.String(50), nullable=False)
    platform = db.Column(db.String(20), nullable=False)
    budget_type = db.Column(db.String(20), nullable=False)
    budget = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='draft')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Campaign performance metrics
    impressions = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    spend = db.Column(db.Float, default=0.0)
    
    # Relationships
    targeting = db.relationship('Targeting', backref='campaign', uselist=False, cascade="all, delete-orphan")
    creative = db.relationship('Creative', backref='campaign', uselist=False, cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'objective': self.objective,
            'platform': self.platform,
            'budget_type': self.budget_type,
            'budget': self.budget,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'status': self.status,
            'impressions': self.impressions,
            'clicks': self.clicks,
            'spend': self.spend,
            'targeting': self.targeting.to_dict() if self.targeting else None,
            'creative': self.creative.to_dict() if self.creative else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Targeting(db.Model):
    __tablename__ = 'targeting'
    
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)
    locations = db.Column(db.String(500), nullable=True)  # JSON string of locations
    age_min = db.Column(db.Integer, nullable=True)
    age_max = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    interests = db.Column(db.String(500), nullable=True)  # JSON string of interests
    
    def to_dict(self):
        import json
        return {
            'locations': json.loads(self.locations) if self.locations else [],
            'age_min': self.age_min,
            'age_max': self.age_max,
            'gender': self.gender,
            'interests': json.loads(self.interests) if self.interests else []
        }

class Creative(db.Model):
    __tablename__ = 'creative'
    
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)
    headline = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(200), nullable=True)
    primary_text = db.Column(db.String(500), nullable=True)
    call_to_action = db.Column(db.String(50), nullable=True)
    image_url = db.Column(db.String(200), nullable=True)
    
    def to_dict(self):
        return {
            'headline': self.headline,
            'description': self.description,
            'primary_text': self.primary_text,
            'call_to_action': self.call_to_action,
            'image_url': self.image_url
        }

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subscription_id = db.Column(db.Integer, db.ForeignKey('subscriptions.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'completed', 'failed'
    external_payment_id = db.Column(db.String(100), nullable=True)  # Reference to payment gateway
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='payments', lazy=True)
    subscription = db.relationship('Subscription', backref='payments', lazy=True)
