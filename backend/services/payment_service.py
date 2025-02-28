
import os
import stripe
import paypalrestsdk
from datetime import datetime
import json
import requests
import base64
import logging

from models import Payment, User, Subscription

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Initialize PayPal
paypalrestsdk.configure({
    "mode": os.getenv('PAYPAL_MODE', 'sandbox'),
    "client_id": os.getenv('PAYPAL_CLIENT_ID'),
    "client_secret": os.getenv('PAYPAL_CLIENT_SECRET')
})

class PaymentService:
    @staticmethod
    def get_stripe_publishable_key():
        """Get Stripe publishable key for the frontend"""
        return os.getenv('STRIPE_PUBLISHABLE_KEY')

    @staticmethod
    def create_stripe_payment_intent(amount, currency='usd', metadata=None):
        """Create a payment intent with Stripe"""
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to cents
                currency=currency,
                metadata=metadata or {}
            )
            return {
                'clientSecret': intent.client_secret,
                'id': intent.id
            }
        except Exception as e:
            logger.error(f"Stripe payment intent creation failed: {str(e)}")
            raise ValueError(f"Payment processing failed: {str(e)}")

    @staticmethod
    def confirm_stripe_payment(payment_intent_id):
        """Confirm that a Stripe payment was successful"""
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return intent.status == 'succeeded'
        except Exception as e:
            logger.error(f"Stripe payment confirmation failed: {str(e)}")
            return False

    @staticmethod
    def create_paypal_payment(amount, currency='USD', description='Subscription Payment'):
        """Create a PayPal payment"""
        try:
            payment = paypalrestsdk.Payment({
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "transactions": [{
                    "amount": {
                        "total": str(amount),
                        "currency": currency
                    },
                    "description": description
                }],
                "redirect_urls": {
                    "return_url": os.getenv('PAYPAL_RETURN_URL', 'http://localhost:5000/api/payments/paypal/success'),
                    "cancel_url": os.getenv('PAYPAL_CANCEL_URL', 'http://localhost:5000/api/payments/paypal/cancel')
                }
            })

            if payment.create():
                approval_url = next(link.href for link in payment.links if link.rel == 'approval_url')
                return {
                    'id': payment.id,
                    'approvalUrl': approval_url
                }
            else:
                logger.error(f"PayPal payment creation failed: {payment.error}")
                raise ValueError(f"PayPal payment failed: {payment.error}")
        except Exception as e:
            logger.error(f"PayPal payment creation failed: {str(e)}")
            raise ValueError(f"PayPal payment failed: {str(e)}")

    @staticmethod
    def execute_paypal_payment(payment_id, payer_id):
        """Execute a PayPal payment after user approval"""
        try:
            payment = paypalrestsdk.Payment.find(payment_id)
            if payment.execute({"payer_id": payer_id}):
                return True
            else:
                logger.error(f"PayPal payment execution failed: {payment.error}")
                return False
        except Exception as e:
            logger.error(f"PayPal payment execution failed: {str(e)}")
            return False

    @staticmethod
    def initiate_mpesa_payment(phone_number, amount, account_reference, transaction_desc='Subscription Payment'):
        """Initiate an MPESA payment"""
        try:
            # MPESA settings
            mpesa_env = os.getenv('MPESA_API_ENV', 'sandbox')
            base_url = "https://sandbox.safaricom.co.ke" if mpesa_env == 'sandbox' else "https://api.safaricom.co.ke"
            
            # Get access token
            consumer_key = os.getenv('MPESA_CONSUMER_KEY')
            consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
            auth_url = f"{base_url}/oauth/v1/generate?grant_type=client_credentials"
            
            auth_response = requests.get(
                auth_url,
                headers={
                    "Authorization": "Basic " + base64.b64encode((consumer_key + ":" + consumer_secret).encode()).decode()
                }
            )
            
            if auth_response.status_code != 200:
                logger.error(f"MPESA auth failed: {auth_response.text}")
                raise ValueError("MPESA authentication failed")
                
            access_token = auth_response.json().get('access_token')
            
            # Format phone number (remove leading 0 or +)
            if phone_number.startswith('+'):
                phone_number = phone_number[1:]
            if phone_number.startswith('0'):
                phone_number = '254' + phone_number[1:]
            
            # Current timestamp
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            
            # Generate password
            shortcode = os.getenv('MPESA_SHORTCODE')
            passkey = os.getenv('MPESA_PASSKEY')
            password = base64.b64encode((shortcode + passkey + timestamp).encode()).decode()
            
            # STK Push request
            stk_url = f"{base_url}/mpesa/stkpush/v1/processrequest"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "BusinessShortCode": shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": int(amount),
                "PartyA": phone_number,
                "PartyB": shortcode,
                "PhoneNumber": phone_number,
                "CallBackURL": os.getenv('MPESA_CALLBACK_URL', 'http://localhost:5000/api/payments/mpesa/callback'),
                "AccountReference": account_reference,
                "TransactionDesc": transaction_desc
            }
            
            response = requests.post(stk_url, json=payload, headers=headers)
            
            if response.status_code != 200:
                logger.error(f"MPESA STK push failed: {response.text}")
                raise ValueError("MPESA payment initiation failed")
                
            return response.json()
            
        except Exception as e:
            logger.error(f"MPESA payment initiation failed: {str(e)}")
            raise ValueError(f"MPESA payment failed: {str(e)}")

    @staticmethod
    def verify_mpesa_callback(callback_data):
        """Verify MPESA callback data"""
        try:
            result_code = callback_data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
            return result_code == 0  # 0 means success
        except Exception as e:
            logger.error(f"MPESA callback verification failed: {str(e)}")
            return False
