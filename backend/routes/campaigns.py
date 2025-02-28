
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import json
from sqlalchemy import desc, asc
from math import ceil

from models import db, Campaign, Targeting, Creative, User
from middleware.rbac import require_permission

campaign_bp = Blueprint('campaigns', __name__)

@campaign_bp.route('/', methods=['GET'])
@jwt_required()
@require_permission('view_own_campaigns')
def get_campaigns():
    try:
        # Get user ID from JWT
        user_id = get_jwt_identity()
        
        # Get query parameters for pagination and filtering
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        platform = request.args.get('platform')
        sort_by = request.args.get('sort_by', 'created_at')
        sort_dir = request.args.get('sort_dir', 'desc')
        
        # Start building the query
        query = Campaign.query.filter_by(user_id=user_id)
        
        # Apply filters if provided
        if status:
            query = query.filter_by(status=status)
        if platform:
            query = query.filter_by(platform=platform)
            
        # Apply sorting
        if sort_dir == 'desc':
            query = query.order_by(desc(getattr(Campaign, sort_by)))
        else:
            query = query.order_by(asc(getattr(Campaign, sort_by)))
            
        # Get total count for pagination
        total_count = query.count()
        total_pages = ceil(total_count / per_page)
        
        # Apply pagination
        campaigns = query.offset((page - 1) * per_page).limit(per_page).all()
        
        # Convert campaigns to dict
        campaign_list = [campaign.to_dict() for campaign in campaigns]
        
        # Prepare pagination metadata
        pagination = {
            'total_count': total_count,
            'total_pages': total_pages,
            'current_page': page,
            'per_page': per_page,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
        
        return jsonify({
            'campaigns': campaign_list,
            'pagination': pagination
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaign_bp.route('/<int:campaign_id>', methods=['GET'])
@jwt_required()
@require_permission('view_own_campaigns')
def get_campaign(campaign_id):
    try:
        # Get user ID from JWT
        user_id = get_jwt_identity()
        
        # Get campaign for the user
        campaign = Campaign.query.filter_by(id=campaign_id, user_id=user_id).first()
        
        # Check if campaign exists and user has access
        if not campaign:
            return jsonify({'error': 'Campaign not found'}), 404
        
        # Convert campaign to dict
        campaign_dict = campaign.to_dict()
        
        return jsonify(campaign_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaign_bp.route('/', methods=['POST'])
@jwt_required()
@require_permission('create_campaign')
def create_campaign():
    try:
        # Get user ID from JWT
        user_id = get_jwt_identity()
        
        # Check subscription limits
        user = User.query.get(user_id)
        campaign_count = Campaign.query.filter_by(user_id=user_id).count()
        
        if user.subscription and campaign_count >= user.subscription.max_campaigns:
            return jsonify({
                'error': 'Campaign limit reached for your subscription plan',
                'message': f'Your plan allows a maximum of {user.subscription.max_campaigns} campaigns'
            }), 403
        
        # Get request data
        data = request.json
        
        # Validate required fields
        if not data.get('name') or not data.get('objective') or not data.get('platform') or not data.get('budgetType') or not data.get('budget') or not data.get('startDate'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Parse dates
        try:
            start_date = datetime.fromisoformat(data.get('startDate').replace('Z', '+00:00'))
            end_date = None
            if data.get('endDate'):
                end_date = datetime.fromisoformat(data.get('endDate').replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
        
        # Create campaign
        campaign = Campaign(
            user_id=user_id,
            name=data.get('name'),
            objective=data.get('objective'),
            platform=data.get('platform'),
            budget_type=data.get('budgetType'),
            budget=data.get('budget'),
            start_date=start_date,
            end_date=end_date,
            status='draft'
        )
        db.session.add(campaign)
        db.session.flush()
        
        # Create targeting
        targeting_data = data.get('targeting', {})
        targeting = Targeting(
            campaign_id=campaign.id,
            locations=json.dumps(targeting_data.get('locations', [])),
            age_min=targeting_data.get('ageMin'),
            age_max=targeting_data.get('ageMax'),
            gender=targeting_data.get('gender'),
            interests=json.dumps(targeting_data.get('interests', []))
        )
        db.session.add(targeting)
        
        # Create creative
        creative_data = data.get('adCreative', {})
        creative = Creative(
            campaign_id=campaign.id,
            headline=creative_data.get('headline'),
            description=creative_data.get('description'),
            primary_text=creative_data.get('primaryText'),
            call_to_action=creative_data.get('callToAction'),
            image_url=creative_data.get('imageUrl')
        )
        db.session.add(creative)
        
        # Commit to database
        db.session.commit()
        
        return jsonify(campaign.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@campaign_bp.route('/<int:campaign_id>', methods=['PUT'])
@jwt_required()
@require_permission('edit_own_campaign')
def update_campaign(campaign_id):
    try:
        # Get user ID from JWT
        user_id = get_jwt_identity()
        
        # Get campaign for the user
        campaign = Campaign.query.filter_by(id=campaign_id, user_id=user_id).first()
        if not campaign:
            return jsonify({'error': 'Campaign not found'}), 404
        
        # Get request data
        data = request.json
        
        # Update campaign fields if provided
        if 'name' in data:
            campaign.name = data.get('name')
        if 'objective' in data:
            campaign.objective = data.get('objective')
        if 'platform' in data:
            campaign.platform = data.get('platform')
        if 'budgetType' in data:
            campaign.budget_type = data.get('budgetType')
        if 'budget' in data:
            campaign.budget = data.get('budget')
        if 'startDate' in data:
            campaign.start_date = datetime.fromisoformat(data.get('startDate').replace('Z', '+00:00'))
        if 'endDate' in data and data.get('endDate'):
            campaign.end_date = datetime.fromisoformat(data.get('endDate').replace('Z', '+00:00'))
        if 'status' in data:
            campaign.status = data.get('status')
        
        # Update targeting if provided
        targeting_data = data.get('targeting')
        if targeting_data:
            # Create targeting if it doesn't exist
            if not campaign.targeting:
                targeting = Targeting(campaign_id=campaign.id)
                db.session.add(targeting)
                db.session.flush()
                campaign.targeting = targeting
            
            # Update targeting fields
            if 'locations' in targeting_data:
                campaign.targeting.locations = json.dumps(targeting_data.get('locations', []))
            if 'ageMin' in targeting_data:
                campaign.targeting.age_min = targeting_data.get('ageMin')
            if 'ageMax' in targeting_data:
                campaign.targeting.age_max = targeting_data.get('ageMax')
            if 'gender' in targeting_data:
                campaign.targeting.gender = targeting_data.get('gender')
            if 'interests' in targeting_data:
                campaign.targeting.interests = json.dumps(targeting_data.get('interests', []))
        
        # Update creative if provided
        creative_data = data.get('adCreative')
        if creative_data:
            # Create creative if it doesn't exist
            if not campaign.creative:
                creative = Creative(campaign_id=campaign.id)
                db.session.add(creative)
                db.session.flush()
                campaign.creative = creative
            
            # Update creative fields
            if 'headline' in creative_data:
                campaign.creative.headline = creative_data.get('headline')
            if 'description' in creative_data:
                campaign.creative.description = creative_data.get('description')
            if 'primaryText' in creative_data:
                campaign.creative.primary_text = creative_data.get('primaryText')
            if 'callToAction' in creative_data:
                campaign.creative.call_to_action = creative_data.get('callToAction')
            if 'imageUrl' in creative_data:
                campaign.creative.image_url = creative_data.get('imageUrl')
        
        # Commit to database
        db.session.commit()
        
        return jsonify(campaign.to_dict()), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@campaign_bp.route('/<int:campaign_id>', methods=['DELETE'])
@jwt_required()
@require_permission('delete_own_campaign')
def delete_campaign(campaign_id):
    try:
        # Get user ID from JWT
        user_id = get_jwt_identity()
        
        # Get campaign for the user
        campaign = Campaign.query.filter_by(id=campaign_id, user_id=user_id).first()
        if not campaign:
            return jsonify({'error': 'Campaign not found'}), 404
        
        # Delete campaign
        db.session.delete(campaign)
        db.session.commit()
        
        return jsonify({'message': 'Campaign deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
