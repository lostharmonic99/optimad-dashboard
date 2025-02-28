
# OptimAd Backend

This is the backend API for OptimAd, a campaign management platform.

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `pip install -r requirements.txt`
4. Copy the environment variables: `cp .env.example .env`
5. Edit the `.env` file and add your configuration values

### Running the server

```bash
python app.py
```

The server will start on port 5000 by default (or the port specified in your .env file).

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password
- `POST /auth/google` - Login with Google
- `POST /auth/facebook` - Login with Facebook
- `GET /auth/me` - Get current user info (requires authentication)

### Campaigns

- `GET /campaigns` - Get all campaigns for the current user
- `GET /campaigns/:id` - Get a specific campaign by ID
- `POST /campaigns` - Create a new campaign
- `PUT /campaigns/:id` - Update an existing campaign
- `DELETE /campaigns/:id` - Delete a campaign

## Environmental Variables

- `PORT` - Port to run the server on (default: 5000)
- `SECRET_KEY` - Secret key for Flask
- `DATABASE_URL` - Database connection string
- `JWT_SECRET_KEY` - Secret key for JWT tokens
- `JWT_ACCESS_TOKEN_EXPIRES` - JWT token expiration time in seconds
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `FACEBOOK_APP_ID` - Facebook App ID
- `FACEBOOK_APP_SECRET` - Facebook App secret
