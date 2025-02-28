
from flask import jsonify

def register_error_handlers(app):
    """Register error handlers for the Flask app."""
    
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'error': 'Bad request', 'message': str(e)}), 400
        
    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({'error': 'Unauthorized', 'message': 'Authentication required'}), 401
        
    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({'error': 'Forbidden', 'message': 'You do not have permission to access this resource'}), 403
        
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Not found', 'message': 'The requested resource was not found'}), 404
        
    @app.errorhandler(422)
    def unprocessable_entity(e):
        return jsonify({'error': 'Unprocessable entity', 'message': str(e)}), 422
        
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Server error', 'message': 'An internal server error occurred'}), 500
