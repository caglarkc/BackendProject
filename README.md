# Modern Backend Project with Node.js

This project is a comprehensive backend application developed using Node.js, Express.js, MongoDB, Redis, and JWT, aimed at learning and implementing modern backend architecture.

## 🎯 Purpose

- Understanding and implementing modern backend architecture
- Applying Clean Code principles
- Learning service-based architectural structure
- Understanding database relationships and optimization
- Learning caching mechanisms (Redis)
- Implementing token-based authentication system
- Developing error handling mechanisms
- Implementing API security and rate limiting

## 🛠 Technologies Used

- **Node.js & Express.js**: Server and API structure
- **MongoDB & Mongoose**: Database and ORM
- **Redis**: Caching and session management
- **JWT**: Token-based authentication
- **Jest**: Test framework
- **SuperTest**: API testing

## 📁 Project Structure

```
my-backend-project/
├── api/
│   └── routes/
│       ├── authRoute.js
│       ├── userRoute.js
│       ├── logRoute.js
│       └── adminRoute.js
├── config/
│   ├── redis.js
│   └── errorMessages.js
├── middleware/
│   ├── authMiddleware.js
│   ├── requestContext.js
│   └── tokenBlacklistMiddleware.js
├── models/
│   └── User.js
├── services/
│   ├── AdminService.js
│   ├── AuthService.js
│   ├── BaseService.js
│   ├── LogService.js
│   ├── RedisService.js
│   ├── TokenService.js
│   └── UserService.js
├── utils/
│   ├── errors/
│   │   ├── AppError.js
│   │   ├── AuthError.js
│   │   ├── NotFoundError.js
│   │   ├── RedisError.js
│   │   ├── RateLimitError.js
│   │   └── ValidationError.js
│   ├── hashPassword.js
│   ├── stringUtils.js
│   └── textUtils.js
├── tests/
│   └── auth/
│       └── token.test.js
├── .env
├── server.js
└── package.json
```

## 🔧 Implementations

### 1. Authentication System
- JWT-based token system (Access & Refresh Token)
- Secure password hashing
- Token blacklist mechanism
- Session management

### 2. Redis Service
- Caching mechanism
- Key-Value operations
- Hash data structure support
- List and Set operations
- Transaction management

### 3. Validation System
- Input validation
- Custom validation rules
- Error handling
- Error message management

### 4. Error Handling
- Custom error classes
- Centralized error management
- HTTP status code integration
- Detailed error messages

### 5. Service Layer
- BaseService abstract class
- CRUD operations
- Service isolation
- Business logic management

### 6. Middleware Structure
- Authentication control
- Request context management
- Token blacklist control
- Rate limiting

### 7. Test Structure
- Unit tests
- Integration tests
- API tests
- Test fixtures

## 🚀 Features

### User Management
- User registration
- User login
- Profile update
- Password reset

### Redis Features
- Key-Value operations
- Hash data structure
- List operations
- Set operations
- Caching strategies
- Transaction management

### Security
- JWT authentication
- Password hashing
- Rate limiting
- Token blacklisting
- Input validation
- Error handling

### Logging
- Operation logs
- Error logs
- User activity tracking

## 🔒 Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/my-backend-db
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
REDIS_USERNAME=default
```

## 🏃‍♂️ Running the Application

1. Install required packages:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Make sure MongoDB and Redis services are running

4. Start the application:
```bash
npm run dev
```

## 🧪 Running Tests

```bash
npm test
```

## 📝 API Endpoints

### Auth Routes
- `POST /api/auth/register`: New user registration
- `POST /api/auth/login`: User login
- `POST /api/auth/refresh`: Token refresh
- `POST /api/auth/logout`: Logout

### User Routes
- `GET /api/users/profile`: User profile
- `PUT /api/users/profile`: Profile update
- `PUT /api/users/password`: Password change

### Admin Routes
- `GET /api/admin/users`: List all users
- `GET /api/admin/logs`: View system logs

### Log Routes
- `GET /api/logs`: View operation logs

## 👥 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more information. 