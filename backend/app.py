from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from flask_migrate import Migrate
from models import db, User, RefreshToken, Subscription, Campaign, Targeting, Creative, Payment

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)

# Flask configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///instance/optimad.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  # 1 hour
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES', 2592000))  # 30 days
app.config['JWT_COOKIE_SECURE'] = os.getenv('JWT_COOKIE_SECURE', 'False').lower() == 'true'
app.config['JWT_COOKIE_CSRF_PROTECT'] = os.getenv('JWT_COOKIE_CSRF_PROTECT', 'True').lower() == 'true'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'

# Initialize Flask extensions
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)  # Frontend URL
jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)

# Register blueprints for routing
from routes.auth import auth_bp
from routes.campaigns import campaign_bp
from routes.subscriptions import subscription_bp
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(campaign_bp, url_prefix='/campaigns')
app.register_blueprint(subscription_bp, url_prefix='/subscriptions')

# Setup error handlers
from middleware.error_handler import register_error_handlers
register_error_handlers(app)

# Setup role-based access control
from middleware.rbac import setup_rbac
setup_rbac(jwt)

@app.route('/')
def index():
    """Health check endpoint for the API."""
    return jsonify({'status': 'API is running'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)