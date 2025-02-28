
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models import User

def setup_rbac(jwt):
    """Setup JWT claims to include user role"""
    
    @jwt.additional_claims_loader
    def add_claims_to_access_token(identity):
        user = User.query.get(identity)
        if user:
            return {'role': user.role}
        return {'role': 'guest'}

def require_permission(permission):
    """Decorator for requiring a specific permission"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Verify JWT
            verify_jwt_in_request()
            
            # Get user ID from JWT
            user_id = get_jwt_identity()
            
            # Get user from database
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Check if user has the required permission
            if not user.has_permission(permission):
                return jsonify({'error': 'Permission denied', 'required': permission}), 403
            
            # User has permission, proceed with the function
            return fn(*args, **kwargs)
        return wrapper
    return decorator
