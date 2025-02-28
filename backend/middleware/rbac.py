from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import JWTManager

def setup_rbac(jwt: JWTManager):
    """Setup JWT claims to include user role."""
    
    @jwt.additional_claims_loader
    def add_claims_to_access_token(identity):
        from models import User
        user = User.query.get(identity)
        if user:
            return {'role': user.role}
        return {'role': 'guest'}

def require_role(role):
    """Decorator to enforce role-based access control."""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # Get the current user from the request (assumes authentication middleware has run)
            user = getattr(request, 'user', None)
            if not user:
                return jsonify({'error': 'Unauthorized'}), 401

            # Check if the user has the required role
            if user.role != role:
                return jsonify({'error': 'Forbidden', 'message': f'Role {role} required'}), 403

            # User has the required role, proceed with the function
            return f(*args, **kwargs)
        return wrapper
    return decorator

def require_permission(permission):
    """Decorator to enforce permission-based access control."""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # Get the current user from the request
            user = getattr(request, 'user', None)
            if not user:
                return jsonify({'error': 'Unauthorized'}), 401

            # Check if the user has the required permission
            if not user.has_permission(permission):
                return jsonify({'error': 'Forbidden', 'message': f'Permission {permission} required'}), 403

            # User has the required permission, proceed with the function
            return f(*args, **kwargs)
        return wrapper
    return decorator