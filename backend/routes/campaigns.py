
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import json

from models import db, Campaign, Targeting, Creative

campaign_bp = Blueprint('campaigns', __name__)

@campaign_bp.route('/', methods=['GET'])
@jwt_required()
def get_campaigns():
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Get campaigns for the user
    campaigns = Campaign.query.filter_by(user_id=user_id).all()
    
    # Convert campaigns to dict
    campaign_list = [campaign.to_dict() for campaign in campaigns]
    
    return jsonify(campaign_list), 200

@campaign_bp.route('/<int:campaign_id>', methods=['GET'])
@jwt_required()
def get_campaign(campaign_id):
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Get campaign for the user
    campaign = Campaign.query.filter_by(id=campaign_id, user_id=user_id).first()
    if not campaign:
        return jsonify({'error': 'Campaign not found'}), 404
    
    # Convert campaign to dict
    campaign_dict = campaign.to_dict()
    
    return jsonify(campaign_dict), 200

@campaign_bp.route('/', methods=['POST'])
@jwt_required()
def create_campaign():
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Get request data
    data = request.json
    
    # Create new campaign
    try:
        # Parse dates
        start_date = datetime.fromisoformat(data.get('startDate').replace('Z', '+00:00'))
        end_date = None
        if data.get('endDate'):
            end_date = datetime.fromisoformat(data.get('endDate').replace('Z', '+00:00'))
        
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
        return jsonify({'error': str(e)}), 400

@campaign_bp.route('/<int:campaign_id>', methods=['PUT'])
@jwt_required()
def update_campaign(campaign_id):
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Get campaign for the user
    campaign = Campaign.query.filter_by(id=campaign_id, user_id=user_id).first()
    if not campaign:
        return jsonify({'error': 'Campaign not found'}), 404
    
    # Get request data
    data = request.json
    
    # Update campaign
    try:
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
        return jsonify({'error': str(e)}), 400

@campaign_bp.route('/<int:campaign_id>', methods=['DELETE'])
@jwt_required()
def delete_campaign(campaign_id):
    # Get user ID from JWT
    user_id = get_jwt_identity()
    
    # Get campaign for the user
    campaign = Campaign.query.filter_by(id=campaign_id, user_id=user_id).first()
    if not campaign:
        return jsonify({'error': 'Campaign not found'}), 404
    
    # Delete campaign
    try:
        db.session.delete(campaign)
        db.session.commit()
        
        return jsonify({'message': 'Campaign deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
