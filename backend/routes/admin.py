from flask import Blueprint, request, jsonify
from models import User, db
from middleware.rbac import require_role

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/create-admin', methods=['POST'])
@require_role('superuser')  # Only superuser can access this route
def create_admin():
    """Create a new admin user."""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400

    # Create new admin
    admin = User(
        email=email,
        first_name=first_name,
        last_name=last_name,
        role='admin',  # Assign admin role
        subscription_status='active'
    )
    admin.set_password(password)

    # Save to database
    db.session.add(admin)
    db.session.commit()

    return jsonify({'message': 'Admin created successfully', 'admin': admin.to_dict()}), 201

@admin_bp.route('/assign-role', methods=['POST'])
@require_role('superuser')  # Only superuser can access this route
def assign_role():
    """Assign a role to a user."""
    data = request.json
    user_id = data.get('user_id')
    role = data.get('role')

    if not user_id or not role:
        return jsonify({'error': 'User ID and role are required'}), 400

    # Check if role is valid
    if role not in ['superuser', 'admin', 'user']:
        return jsonify({'error': 'Invalid role'}), 400

    # Find user by ID
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Assign role
    user.role = role
    db.session.commit()

    return jsonify({'message': 'Role assigned successfully', 'user': user.to_dict()}), 200