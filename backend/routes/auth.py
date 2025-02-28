
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, 
    get_jwt_identity,
    jwt_required
)
import requests
import json
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data.get('email')).first()
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 400
    
    # Create new user
    user = User(
        email=data.get('email'),
        first_name=data.get('firstName'),
        last_name=data.get('lastName')
    )
    
    # Set password if provided
    if data.get('password'):
        user.set_password(data.get('password'))
    
    # Save user to database
    db.session.add(user)
    db.session.commit()
    
    # Generate access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Find user by email
    user = User.query.filter_by(email=data.get('email')).first()
    
    # Check if user exists and password is correct
    if not user or not user.check_password(data.get('password')):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Generate access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/google', methods=['POST'])
def google_login():
    data = request.json
    token = data.get('token')
    
    # Verify Google token
    try:
        google_response = requests.get(f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}')
        google_data = google_response.json()
        
        if 'error' in google_data:
            return jsonify({'error': 'Invalid Google token'}), 401
        
        email = google_data.get('email')
        google_id = google_data.get('sub')
        
        # Find user by Google ID or email
        user = User.query.filter_by(google_id=google_id).first()
        if not user:
            user = User.query.filter_by(email=email).first()
            
        # Create new user if not found
        if not user:
            user = User(
                email=email,
                first_name=google_data.get('given_name'),
                last_name=google_data.get('family_name'),
                google_id=google_id
            )
            db.session.add(user)
        else:
            # Update existing user with Google ID if needed
            if not user.google_id:
                user.google_id = google_id
                
        db.session.commit()
        
        # Generate access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/facebook', methods=['POST'])
def facebook_login():
    data = request.json
    token = data.get('token')
    
    # Verify Facebook token
    try:
        facebook_response = requests.get(f'https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token={token}')
        facebook_data = facebook_response.json()
        
        if 'error' in facebook_data:
            return jsonify({'error': 'Invalid Facebook token'}), 401
        
        email = facebook_data.get('email')
        facebook_id = facebook_data.get('id')
        
        # Find user by Facebook ID or email
        user = User.query.filter_by(facebook_id=facebook_id).first()
        if not user and email:
            user = User.query.filter_by(email=email).first()
            
        # Create new user if not found
        if not user:
            user = User(
                email=email,
                first_name=facebook_data.get('first_name'),
                last_name=facebook_data.get('last_name'),
                facebook_id=facebook_id
            )
            db.session.add(user)
        else:
            # Update existing user with Facebook ID if needed
            if not user.facebook_id:
                user.facebook_id = facebook_id
                
        db.session.commit()
        
        # Generate access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Find user by ID
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200
