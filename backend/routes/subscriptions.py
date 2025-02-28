
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
import json
import stripe

from models import db, User, Subscription, Payment

subscription_bp = Blueprint('subscriptions', __name__)

# Initialize Stripe with API key
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@subscription_bp.route('/', methods=['GET'])
def get_subscriptions():
    """Get all active subscription plans"""
    try:
        subscriptions = Subscription.query.filter_by(is_active=True).all()
        return jsonify([sub.to_dict() for sub in subscriptions]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/my-subscription', methods=['GET'])
@jwt_required()
def get_user_subscription():
    """Get current user's subscription details"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        subscription_data = {
            'status': user.subscription_status,
            'endDate': user.subscription_end_date.isoformat() if user.subscription_end_date else None,
            'plan': user.subscription.to_dict() if user.subscription else None
        }
        
        return jsonify(subscription_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/subscribe', methods=['POST'])
@jwt_required()
def subscribe():
    """Create a new subscription for the user"""
    try:
        data = request.json
        user_id = get_jwt_identity()
        
        # Validate required fields
        if not data.get('subscriptionId') or not data.get('paymentMethodId'):
            return jsonify({'error': 'Subscription ID and payment method ID are required'}), 400
            
        # Get user and subscription
        user = User.query.get(user_id)
        subscription = Subscription.query.get(data.get('subscriptionId'))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        if not subscription:
            return jsonify({'error': 'Subscription plan not found'}), 404
            
        if not subscription.is_active:
            return jsonify({'error': 'Subscription plan is not active'}), 400
            
        # Create payment intent with Stripe
        try:
            # This is where you would integrate with Stripe
            # For now, we'll simulate a successful payment
            payment_intent = {
                'id': f'pi_{datetime.now().timestamp()}',
                'amount': int(subscription.price * 100),  # Convert to cents
                'status': 'succeeded'
            }
            
            # Update user subscription
            user.subscription_id = subscription.id
            user.subscription_status = 'active'
            user.subscription_end_date = datetime.utcnow() + timedelta(days=subscription.duration_days)
            
            # Create payment record
            payment = Payment(
                user_id=user.id,
                subscription_id=subscription.id,
                amount=subscription.price,
                status='completed',
                external_payment_id=payment_intent['id']
            )
            
            db.session.add(payment)
            db.session.commit()
            
            return jsonify({
                'message': 'Subscription created successfully',
                'subscription': {
                    'status': user.subscription_status,
                    'endDate': user.subscription_end_date.isoformat(),
                    'plan': subscription.to_dict()
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': f'Payment processing failed: {str(e)}'}), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/cancel', methods=['POST'])
@jwt_required()
def cancel_subscription():
    """Cancel user's current subscription"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        if user.subscription_status != 'active':
            return jsonify({'error': 'No active subscription to cancel'}), 400
            
        # Cancel the subscription
        user.subscription_status = 'canceled'
        db.session.commit()
        
        return jsonify({
            'message': 'Subscription canceled successfully',
            'subscription': {
                'status': user.subscription_status,
                'endDate': user.subscription_end_date.isoformat() if user.subscription_end_date else None
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events"""
    try:
        payload = request.get_data(as_text=True)
        sig_header = request.headers.get('Stripe-Signature')
        
        # This is where you would verify and process Stripe webhooks
        # For now, we'll just return a success response
        
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
