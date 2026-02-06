# Puri Platform - Custom Identity Provider System

A full-stack authentication system that demonstrates a custom identity provider (like Google Accounts) with "Sign in with Puri" functionality.

## 🎯 Overview

This project contains:

1. **Puri Account System** - A custom identity provider that manages @puri.com email accounts
2. **Client Website** - A demo website that uses "Sign in with Puri" for authentication

## 🏗️ Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│  Website Frontend   │────────▶│  Website Backend    │
│   (Vue 3 - :5173)   │         │   (Express - :4000) │
└─────────────────────┘         └──────────┬──────────┘
                                            │
                                            │ Verifies Token
                                            ▼
┌─────────────────────┐         ┌─────────────────────┐
│ Puri Auth Frontend  │────────▶│ Puri Auth Backend   │
│   (Vue 3 - :3000)   │         │   (Express - :5000) │
└─────────────────────┘         └──────────┬──────────┘
                                            │
                                            │ Stores Users
                                            ▼
                                    ┌───────────────┐
                                    │   MongoDB     │
                                    │   (:27017)    │
                                    └───────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- No manual setup required!

### Running the Project

1. **Navigate to the project directory:**
   ```bash
   cd puri-platform
   ```

2. **Start all services:**
   ```bash
   docker-compose up
   ```
   
   Or explicitly specify the file:
   ```bash
   docker-compose -f docker-compose.yml up
   ```

   Or run in detached mode:
   ```bash
   docker-compose up -d
   ```

3. **Access the applications:**
   - **Puri Account System**: http://localhost:3000
   - **Client Website**: http://localhost:5173
   - **Puri Auth API**: http://localhost:5000
   - **Website API**: http://localhost:4000

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

   To also remove volumes (clears database):
   ```bash
   docker-compose down -v
   ```

## 📋 Services & Ports

| Service | Port | Description |
|---------|------|-------------|
| Puri Auth Frontend | 3000 | Signup/Login UI for Puri Account |
| Puri Auth Backend | 5000 | Authentication API (source of truth) |
| Website Frontend | 5173 | Client website with "Sign in with Puri" |
| Website Backend | 4000 | Website API (verifies tokens with Puri Auth) |
| MongoDB | 27017 | Database for user storage |

## 🔐 Authentication Flow

1. User visits the client website (localhost:5173)
2. Clicks "Sign in with Puri" button
3. Redirects to Puri Account login page (localhost:3000)
4. User logs in with @puri.com email
5. Puri Auth issues JWT token
6. Token is passed back to website
7. Website backend verifies token with Puri Auth API
8. User is authenticated and can access protected content

## 📝 Creating an Account

1. Go to http://localhost:3000
2. Click "Create one" or navigate to `/signup`
3. Enter a username (e.g., "john")
4. Enter a password (minimum 6 characters)
5. Your email will be `john@puri.com`
6. Account is automatically verified

## 🔑 Key Features

- ✅ Only @puri.com emails allowed
- ✅ Centralized authentication system
- ✅ JWT token-based authentication
- ✅ Real-time token verification
- ✅ Service-to-service authentication
- ✅ Clean separation of concerns
- ✅ Fully containerized with Docker

## 🛠️ Technology Stack

- **Frontend**: Vue 3 + Vite + Vue Router
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Containerization**: Docker + Docker Compose

## 📁 Project Structure

```
puri-platform/
├── puri-auth/                 # Puri Account System
│   ├── frontend/              # Vue frontend (login/signup)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Signup.vue
│   │   │   │   ├── Login.vue
│   │   │   │   └── Dashboard.vue
│   │   │   ├── App.vue
│   │   │   └── main.js
│   │   └── Dockerfile
│   │
│   └── backend/               # Auth backend (source of truth)
│       ├── routes/
│       │   └── auth.routes.js
│       ├── models/
│       │   └── user.model.js
│       ├── middleware/
│       │   └── auth.middleware.js
│       ├── server.js
│       └── Dockerfile
│
├── website/                   # Client website
│   ├── frontend/              # Vue frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Home.vue
│   │   │   │   └── Dashboard.vue
│   │   │   ├── App.vue
│   │   │   └── main.js
│   │   └── Dockerfile
│   │
│   └── backend/               # Website backend
│       ├── routes/
│       │   └── auth.routes.js
│       ├── middleware/
│       │   └── verify.middleware.js
│       ├── server.js
│       └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## 🔒 Security Notes

- Service-to-service communication uses `x-service-secret` header
- JWT tokens expire after 24 hours (configurable)
- Passwords are hashed using bcrypt
- Only verified @puri.com users can access the website
- CORS is properly configured for localhost

## 🧪 Testing the Flow

1. **Create a Puri Account:**
   - Visit http://localhost:3000/signup
   - Create account: `test@puri.com` with password `test123`

2. **Use Sign in with Puri:**
   - Visit http://localhost:5173
   - Click "Sign in with Puri"
   - Login with your Puri account
   - You'll be redirected back and logged in

3. **Access Protected Content:**
   - After login, you'll see the dashboard
   - This page is only accessible after authentication

## 🐛 Troubleshooting

- **Services not starting**: Make sure ports 3000, 4000, 5000, 5173, and 27017 are not in use
- **Database connection errors**: Wait a few seconds for MongoDB to fully start
- **CORS errors**: Ensure all services are running and URLs are correct
- **Token verification fails**: Check that SERVICE_SECRET matches in both backends

## 📚 API Endpoints

### Puri Auth Backend (localhost:5000)

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login and get token
- `POST /api/auth/verify-token` - Verify token (for services)
- `GET /api/auth/me` - Get current user (protected)

### Website Backend (localhost:4000)

- `POST /api/auth/puri-login` - Login with Puri token
- `POST /api/auth/logout` - Logout

## 🎓 Learning Points

This project demonstrates:
- Custom OAuth-like flow
- Microservices architecture
- Service-to-service authentication
- JWT token management
- Docker containerization
- Centralized identity provider pattern

## 📄 License

This is a demonstration project for educational purposes.

