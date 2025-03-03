from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    get_jwt,
    decode_token  # Added for decoding refresh tokens
)
import requests
import json
from datetime import datetime, timedelta
import uuid
from email_validator import validate_email, EmailNotValidError

from models import db, User, RefreshToken

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Validate email format
        try:
            validate_email(data.get('email'))
        except EmailNotValidError:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        if len(data.get('password', '')) < 8:
            return jsonify({'error': 'Password must be at least 8 characters long'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data.get('email')).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            email=data.get('email'),
            first_name=data.get('firstName'),
            last_name=data.get('lastName'),
            role='user',  # Default role
            subscription_status='free'  # Default subscription
        )
        
        # Set password
        user.set_password(data.get('password'))
        
        # Save user to database
        db.session.add(user)
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        # Store refresh token
        store_refresh_token(user.id, refresh_token)
        
        resp = make_response(jsonify({
            'user': user.to_dict(),
            'message': 'Registration successful'
        }), 201)
        
        # Set cookies
        set_access_cookies(resp, access_token)
        set_refresh_cookies(resp, refresh_token)
        
        return resp
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        # Find user by email
        user = User.query.filter_by(email=data.get('email')).first()
        
        # Check if user exists and password is correct
        if not user or not user.check_password(data.get('password')):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        # Store refresh token
        store_refresh_token(user.id, refresh_token)
        
        resp = make_response(jsonify({
            'user': user.to_dict(),
            'message': 'Login successful'
        }), 200)
        
        # Set cookies
        set_access_cookies(resp, access_token)
        set_refresh_cookies(resp, refresh_token)
        
        return resp
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/google', methods=['POST'])
def google_login():
    try:
        data = request.json
        token = data.get('token')
        
        # Verify Google token
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
                google_id=google_id,
                role='user',
                subscription_status='free'
            )
            db.session.add(user)
        else:
            # Update existing user with Google ID if needed
            if not user.google_id:
                user.google_id = google_id
                
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        # Store refresh token
        store_refresh_token(user.id, refresh_token)
        
        resp = make_response(jsonify({
            'user': user.to_dict(),
            'message': 'Google login successful'
        }), 200)
        
        # Set cookies
        set_access_cookies(resp, access_token)
        set_refresh_cookies(resp, refresh_token)
        
        return resp
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/facebook', methods=['POST'])
def facebook_login():
    try:
        data = request.json
        token = data.get('token')
        
        # Verify Facebook token
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
                facebook_id=facebook_id,
                role='user',
                subscription_status='free'
            )
            db.session.add(user)
        else:
            # Update existing user with Facebook ID if needed
            if not user.facebook_id:
                user.facebook_id = facebook_id
                
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        # Store refresh token
        store_refresh_token(user.id, refresh_token)
        
        resp = make_response(jsonify({
            'user': user.to_dict(),
            'message': 'Facebook login successful'
        }), 200)
        
        # Set cookies
        set_access_cookies(resp, access_token)
        set_refresh_cookies(resp, refresh_token)
        
        return resp
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    try:
        # Get user ID from JWT
        user_id = get_jwt_identity()
        
        # Find user by ID
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    try:
        # Get user ID from refresh token
        user_id = get_jwt_identity()
        
        # Find user by ID
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get the refresh token from the database
        refresh_token_jti = get_jwt().get('jti')  # JWT ID of the refresh token
        db_refresh_token = RefreshToken.query.filter_by(token=refresh_token_jti, user_id=user_id).first()
        
        # Check if the refresh token exists and is valid
        if not db_refresh_token or not db_refresh_token.is_valid():
            return jsonify({'error': 'Invalid or expired refresh token'}), 401
        
        # Generate new access token
        access_token = create_access_token(identity=str(user_id))
        
        resp = make_response(jsonify({
            'message': 'Token refreshed successfully'
        }), 200)
        
        # Set access cookie
        set_access_cookies(resp, access_token)
        
        return resp
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required(optional=True)
def logout():
    try:
        # Get current token
        token_jti = get_jwt().get('jti', None)
        user_id = get_jwt_identity()
        
        # Delete refresh token if user is logged in
        if user_id and token_jti:
            RefreshToken.query.filter_by(token=token_jti, user_id=user_id).delete()
            db.session.commit()
        
        resp = make_response(jsonify({
            'message': 'Logged out successfully'
        }), 200)
        
        # Remove JWT cookies
        unset_jwt_cookies(resp)
        
        return resp
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Helper functions for refresh token management
def store_refresh_token(user_id, refresh_token_jwt):
    """Store a refresh token in the database by decoding the JWT and extracting the jti."""
    try:
        # Decode the refresh token to extract the jti
        decoded_token = decode_token(refresh_token_jwt)
        token_id = decoded_token.get('jti')
        
        if not token_id:
            raise ValueError("Refresh token does not contain a valid 'jti'")
        
        # Calculate expiry time
        expires_at = datetime.utcnow() + timedelta(days=30)  # 30 days
        
        # Create new refresh token
        refresh_token = RefreshToken(
            user_id=user_id,
            token=token_id,  # Store the JWT ID (jti)
            expires_at=expires_at
        )
        
        # Save to database
        db.session.add(refresh_token)
        db.session.commit()
        
        return refresh_token
    except Exception as e:
        db.session.rollback()
        raise Exception(f"Failed to store refresh token: {str(e)}")

def delete_refresh_tokens(user_id):
    """Delete all refresh tokens for a given user."""
    RefreshToken.query.filter_by(user_id=user_id).delete()
    db.session.commit()