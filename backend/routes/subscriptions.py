
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
import json

from models import db, User, Subscription, Payment
from services.payment_service import PaymentService

subscription_bp = Blueprint('subscriptions', __name__)

payment_service = PaymentService()

@subscription_bp.route('/', methods=['GET'])
def get_subscriptions():
    """Get all active subscription plans"""
    try:
        subscriptions = Subscription.query.filter_by(is_active=True).all()
        return jsonify([sub.to_dict() for sub in subscriptions]), 200
    except Exception as e:
        current_app.logger.error(f"Error getting subscriptions: {str(e)}")
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
        current_app.logger.error(f"Error getting user subscription: {str(e)}")
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/payment-config', methods=['GET'])
def get_payment_config():
    """Get payment configuration for the frontend"""
    try:
        return jsonify({
            'stripe': {
                'publishableKey': payment_service.get_stripe_publishable_key()
            },
            'paypal': {
                'clientId': os.getenv('PAYPAL_CLIENT_ID'),
                'mode': os.getenv('PAYPAL_MODE', 'sandbox')
            },
            'mpesa': {
                'enabled': bool(os.getenv('MPESA_CONSUMER_KEY')),
                'env': os.getenv('MPESA_API_ENV', 'sandbox')
            }
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error getting payment config: {str(e)}")
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/subscribe/stripe', methods=['POST'])
@jwt_required()
def subscribe_with_stripe():
    """Create a new subscription using Stripe"""
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
            payment_intent = payment_service.create_stripe_payment_intent(
                amount=subscription.price,
                metadata={
                    'user_id': user_id,
                    'subscription_id': subscription.id
                }
            )
            
            return jsonify({
                'clientSecret': payment_intent['clientSecret'],
                'paymentIntentId': payment_intent['id']
            }), 200
            
        except Exception as e:
            current_app.logger.error(f"Stripe payment processing failed: {str(e)}")
            return jsonify({'error': f'Payment processing failed: {str(e)}'}), 400
            
    except Exception as e:
        current_app.logger.error(f"Error in stripe subscription: {str(e)}")
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/subscribe/paypal', methods=['POST'])
@jwt_required()
def subscribe_with_paypal():
    """Create a new subscription using PayPal"""
    try:
        data = request.json
        user_id = get_jwt_identity()
        
        # Validate required fields
        if not data.get('subscriptionId'):
            return jsonify({'error': 'Subscription ID is required'}), 400
            
        # Get user and subscription
        user = User.query.get(user_id)
        subscription = Subscription.query.get(data.get('subscriptionId'))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        if not subscription:
            return jsonify({'error': 'Subscription plan not found'}), 404
            
        if not subscription.is_active:
            return jsonify({'error': 'Subscription plan is not active'}), 400
            
        # Create PayPal payment
        try:
            payment = payment_service.create_paypal_payment(
                amount=subscription.price,
                description=f"Subscription to {subscription.name} plan"
            )
            
            # Store payment info in session or database for later retrieval
            # We'll handle this in the PayPal callback routes
            
            return jsonify({
                'paymentId': payment['id'],
                'approvalUrl': payment['approvalUrl']
            }), 200
            
        except Exception as e:
            current_app.logger.error(f"PayPal payment processing failed: {str(e)}")
            return jsonify({'error': f'Payment processing failed: {str(e)}'}), 400
            
    except Exception as e:
        current_app.logger.error(f"Error in paypal subscription: {str(e)}")
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/subscribe/mpesa', methods=['POST'])
@jwt_required()
def subscribe_with_mpesa():
    """Create a new subscription using MPESA"""
    try:
        data = request.json
        user_id = get_jwt_identity()
        
        # Validate required fields
        if not data.get('subscriptionId') or not data.get('phoneNumber'):
            return jsonify({'error': 'Subscription ID and phone number are required'}), 400
            
        # Get user and subscription
        user = User.query.get(user_id)
        subscription = Subscription.query.get(data.get('subscriptionId'))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        if not subscription:
            return jsonify({'error': 'Subscription plan not found'}), 404
            
        if not subscription.is_active:
            return jsonify({'error': 'Subscription plan is not active'}), 400
            
        # Initiate MPESA payment
        try:
            mpesa_response = payment_service.initiate_mpesa_payment(
                phone_number=data.get('phoneNumber'),
                amount=subscription.price,
                account_reference=f"SUB{subscription.id}",
                transaction_desc=f"Subscription to {subscription.name} plan"
            )
            
            # Store necessary info for later validation
            # We'll handle this in the MPESA callback route
            
            return jsonify({
                'requestId': mpesa_response.get('CheckoutRequestID'),
                'message': 'MPESA payment initiated. Please check your phone to complete the transaction.'
            }), 200
            
        except Exception as e:
            current_app.logger.error(f"MPESA payment processing failed: {str(e)}")
            return jsonify({'error': f'Payment processing failed: {str(e)}'}), 400
            
    except Exception as e:
        current_app.logger.error(f"Error in MPESA subscription: {str(e)}")
        return jsonify({'error': str(e)}), 500

@subscription_bp.route('/confirm-payment', methods=['POST'])
@jwt_required()
def confirm_payment():
    """Confirm payment and activate subscription"""
    try:
        data = request.json
        user_id = get_jwt_identity()
        
        if not data.get('subscriptionId') or not data.get('paymentId') or not data.get('paymentMethod'):
            return jsonify({'error': 'Subscription ID, payment ID, and payment method are required'}), 400
            
        user = User.query.get(user_id)
        subscription = Subscription.query.get(data.get('subscriptionId'))
        
        if not user or not subscription:
            return jsonify({'error': 'User or subscription plan not found'}), 404
            
        # Verify payment based on payment method
        payment_confirmed = False
        payment_method = data.get('paymentMethod')
        
        if payment_method == 'stripe':
            payment_confirmed = payment_service.confirm_stripe_payment(data.get('paymentId'))
        elif payment_method == 'paypal':
            payer_id = data.get('payerId')
            if not payer_id:
                return jsonify({'error': 'PayPal payer ID is required'}), 400
            payment_confirmed = payment_service.execute_paypal_payment(data.get('paymentId'), payer_id)
        elif payment_method == 'mpesa':
            # For MPESA, we typically verify through the callback
            # This route could be used for manual confirmation if needed
            payment_confirmed = True  # This would be replaced with actual verification
        else:
            return jsonify({'error': 'Invalid payment method'}), 400
            
        if not payment_confirmed:
            return jsonify({'error': 'Payment could not be confirmed'}), 400
            
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
            external_payment_id=data.get('paymentId')
        )
        
        db.session.add(payment)
        db.session.commit()
        
        return jsonify({
            'message': 'Payment confirmed and subscription activated successfully',
            'subscription': {
                'status': user.subscription_status,
                'endDate': user.subscription_end_date.isoformat(),
                'plan': subscription.to_dict()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error confirming payment: {str(e)}")
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
        current_app.logger.error(f"Error canceling subscription: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Payment provider webhooks
@subscription_bp.route('/webhook/stripe', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events"""
    try:
        payload = request.get_data(as_text=True)
        sig_header = request.headers.get('Stripe-Signature')
        
        # Verify webhook signature
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
            )
        except Exception as e:
            current_app.logger.error(f"Stripe webhook verification failed: {str(e)}")
            return jsonify({'error': 'Webhook verification failed'}), 400
            
        # Handle specific events
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            
            # Extract metadata
            metadata = payment_intent.get('metadata', {})
            user_id = metadata.get('user_id')
            subscription_id = metadata.get('subscription_id')
            
            if user_id and subscription_id:
                # Process successful payment
                try:
                    user = User.query.get(int(user_id))
                    subscription = Subscription.query.get(int(subscription_id))
                    
                    if user and subscription:
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
                        
                        current_app.logger.info(f"Subscription activated for user {user_id}")
                except Exception as e:
                    current_app.logger.error(f"Error processing Stripe webhook: {str(e)}")
                    db.session.rollback()
        
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        current_app.logger.error(f"Error in Stripe webhook: {str(e)}")
        return jsonify({'error': str(e)}), 400

@subscription_bp.route('/webhook/paypal', methods=['POST'])
def paypal_webhook():
    """Handle PayPal webhook events"""
    try:
        # PayPal webhook implementation would go here
        # Similar to Stripe webhook but with PayPal-specific event handling
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        current_app.logger.error(f"Error in PayPal webhook: {str(e)}")
        return jsonify({'error': str(e)}), 400

@subscription_bp.route('/webhook/mpesa', methods=['POST'])
def mpesa_webhook():
    """Handle MPESA callback"""
    try:
        callback_data = request.json
        
        # Verify the callback
        if payment_service.verify_mpesa_callback(callback_data):
            # Extract necessary data
            # Implementation depends on MPESA callback structure
            # Process the successful payment similar to Stripe webhook
            pass
            
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        current_app.logger.error(f"Error in MPESA webhook: {str(e)}")
        return jsonify({'error': str(e)}), 400
