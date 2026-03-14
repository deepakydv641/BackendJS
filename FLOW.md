# Project Flow Documentation

## Overview
This is a Node.js Express backend application with user registration functionality.

## Project Structure
```
Backend/
├── src/
│   ├── controllers/
│   │   └── user.controller.js     # User business logic
│   ├── routes/
│   │   └── user.routes.js         # User route definitions
│   ├── utils/
│   │   └── asyncHandler.js        # Async error handling utility
│   ├── db/
│   │   └── index.js              # Database connection
│   ├── models/
│   │   ├── user.model.js         # User schema
│   │   └── video.model.js         # Video schema
│   ├── middlewares/
│   │   └── multer.middleware.js   # File upload middleware
│   ├── app.js                     # Express app configuration
│   ├── index.js                   # Server entry point
│   └── constant.js                # Application constants
├── public/
│   └── temp/                      # Temporary file storage
├── .postman/                      # Postman configurations
├── package.json                   # Dependencies
└── README.md                      # Project documentation
```

## Request Flow

### 1. Server Startup Flow
```
index.js → ConnectDB() → app.listen()
```

**Detailed Steps:**
1. `index.js` imports database connection and app
2. `ConnectDB()` establishes database connection
3. On successful connection, app starts listening on PORT 8000
4. On database connection failure, process exits

### 2. User Registration Flow
```
Client Request → Express App → User Routes → User Controller → Response
```

**Detailed Steps:**
1. **Client**: Sends POST request to `/api/v1/users/register`
2. **app.js**: 
   - Applies CORS middleware
   - Parses JSON body (limit: 16kb)
   - Parses URL-encoded data
   - Routes to `/api/v1/users` router
3. **user.routes.js**: 
   - Matches `/register` path
   - Calls `registerUser` controller
4. **user.controller.js**: 
   - `asyncHandler` wraps the function for error handling
   - Executes registration logic
   - Sends JSON response with status 200
5. **Response**: Returns `{"message": "ok"}` to client

## Current Implementation Status

### ✅ Completed Components
- **Server Setup**: Express app configured with middleware
- **Database Connection**: MongoDB connection setup
- **Routing**: User registration route defined
- **Controller**: Basic user registration logic
- **Error Handling**: Async handler utility implemented
- **File Structure**: Organized project structure

### 🔄 In Progress/Partial
- **User Model**: Schema exists but not integrated
- **Database Operations**: Connection ready but no CRUD operations
- **Request Validation**: Missing input validation
- **Business Logic**: Registration logic is basic (just returns "ok")

### ❌ Not Implemented
- **User Input Processing**: No data extraction from request body
- **Password Hashing**: No security implementation
- **Database Storage**: No user creation in database
- **Input Validation**: No field validation
- **Error Responses**: No specific error handling
- **Authentication**: No JWT or session management
- **File Upload**: Multer middleware exists but not used

## API Endpoints

### Current Endpoints
- `POST /api/v1/users/register` - User registration (basic implementation)

### Console Logs Flow
When server starts:
1. "Registering user controller" (from user.controller.js)
2. "Registering user routes" (from user.routes.js)
3. "Registering user routes at /api/v1/users" (from app.js)
4. "server is running on port [PORT]" (from index.js)

When registration request is made:
1. "User registered successfully" (from registerUser function)

## Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cookie-parser**: Cookie parsing middleware
- **cors**: Cross-origin resource sharing
- **multer**: File upload middleware

## Environment Variables Required
- `PORT`: Server port (defaults to 8000)
- `CORS_ORIGIN`: CORS allowed origin

## Next Steps for Complete Registration Flow
1. Extract user data from request body
2. Validate input fields
3. Hash passwords
4. Create user in database
5. Handle duplicate user errors
6. Return appropriate success/error responses
7. Add input validation middleware
8. Implement authentication tokens
