
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
    
    # Relationship with campaigns
    campaigns = db.relationship('Campaign', backref='user', lazy=True)
    
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
            'createdAt': self.created_at.isoformat()
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
