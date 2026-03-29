# 🎬 VidStream

A full-featured **YouTube-like Website** REST API built from scratch with **Node.js**, **Express**, **MongoDB**, and **Cloudinary**. Supports user authentication, video management, subscriptions, likes, comments, tweets, and a Redis-powered forgot-password flow.

---

## ✨ Features

- 🔐 **JWT Authentication** — Access token + Refresh token system with HTTP-only cookies
- 📹 **Video Management** — Upload, update, delete, and fetch videos (stored on Cloudinary)
- 👥 **Subscriptions** — Toggle subscribe/unsubscribe, fetch subscribers and subscribed channels
- 👍 **Likes** — Toggle likes on videos, comments, and tweets
- 💬 **Comments** — Add, edit, delete, and fetch comments on videos
- 🐦 **Tweets / Community Posts** — Create posts with image attachments
- 📜 **Watch History** — Track and fetch a user's video watch history
- 🔑 **Forgot Password** — OTP-based password reset via email (Redis TTL)
- 📺 **Channel Profiles** — View any user's channel with subscriber counts via MongoDB aggregation
- 🔍 **Search** — Search videos by title/description

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| File Storage | Cloudinary |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| File Uploads | Multer |
| OTP Cache | Redis |
| Email | Nodemailer |
| Dev Server | Nodemon |

---

## 📁 Project Structure

```
Backend/
├── src/
│   ├── index.js                  # Entry point — loads env, connects DB, starts server
│   ├── app.js                    # Express app — registers middlewares & all routes
│   ├── constant.js               # App constants (DB_NAME)
│   │
│   ├── db/
│   │   └── index.js              # MongoDB connection (ConnectDB)
│   │
│   ├── models/
│   │   ├── user.model.js         # User schema (JWT methods + bcrypt hook)
│   │   ├── video.model.js        # Video schema (Cloudinary URLs, owner ref)
│   │   ├── subscription.model.js # Subscription schema (subscriber ↔ channel)
│   │   ├── like.model.js         # Polymorphic like schema (video/comment/tweet)
│   │   ├── comment.model.js      # Comment schema (video + owner refs)
│   │   ├── tweet.model.js        # Tweet schema (content + poster image)
│   │   └── playlist.model.js     # Playlist schema
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js    # verifyJWT — protects private routes
│   │   └── multer.middleware.js  # Handles multipart/form-data file uploads
│   │
│   ├── controllers/
│   │   ├── user.controller.js          # Register, login, logout, profile, watch history
│   │   ├── video.controller.js         # Upload, update, delete, watch history
│   │   ├── subscription.controller.js  # Toggle subscribe, get subscribers
│   │   ├── like.controller.js          # Toggle likes, get liked videos
│   │   ├── comment.controller.js       # CRUD for comments
│   │   ├── tweet.controller.js         # CRUD for tweets/community posts
│   │   ├── forgotpassword.controller.js# OTP generation, validation, reset
│   │   ├── mailer.controller.js        # Nodemailer helper
│   │   ├── search.controller.js        # Search videos by query
│   │   └── download.controller.js      # Video download helper
│   │
│   ├── routes/
│   │   ├── user.routes.js        # /api/v1/users
│   │   ├── videos.routes.js      # /api/v1/videos
│   │   ├── subscription.routes.js# /api/v1/subscriptions
│   │   ├── like.routes.js        # /api/v1/likes
│   │   ├── comment.routes.js     # /api/v1/comments
│   │   ├── tweet.routes.js       # /api/v1/tweets
│   │   ├── search.routes.js      # /api/v1/search
│   │   └── download.routes.js    # /api/v1/download
│   │
│   └── utils/
│       ├── asyncHandler.js       # Wraps async controllers to catch errors
│       ├── apiError.js           # Custom error class with HTTP status code
│       ├── apiResponse.js        # Standard success response shape
│       └── cloudinary.js         # Upload/delete files on Cloudinary
│
├── public/temp/                  # Temporary file storage (auto-created by multer)
├── .env                          # Environment variables (DO NOT commit)
├── .env.sample                   # Sample env file
├── package.json
└── Readme.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Redis instance (e.g., Redis Cloud)
- Gmail App Password (for Nodemailer)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd BackendJS

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.sample .env
# Edit .env with your actual credentials

# 4. Start the development server
npm run dev
```

Server starts at: `http://localhost:8000`

---

## 📡 API Reference

All routes are prefixed with `/api/v1`.

### 🔐 User Routes — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/register` | ❌ | Register a new user (multipart: avatar, coverImage) |
| `POST` | `/login` | ❌ | Login with email/username + password |
| `POST` | `/logout` | ✅ | Logout and clear tokens |
| `POST` | `/refresh-access-token` | ❌ | Get new access token using refresh token |
| `PATCH` | `/change-password` | ✅ | Change logged-in user's password |
| `GET` | `/current-user` | ✅ | Get currently logged-in user |
| `PATCH` | `/update-account` | ✅ | Update username and email |
| `GET` | `/c/:username` | ✅ | Get channel profile with subscriber count |
| `GET` | `/watch-history` | ✅ | Get user's watch history |
| `POST` | `/forgot-password` | ❌ | Send OTP to email for password reset |
| `POST` | `/verify-otp` | ❌ | Validate OTP |
| `POST` | `/reset-password` | ❌ | Reset password after OTP verified |

---

### 🎥 Video Routes — `/api/v1/videos`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/upload-video` | ✅ | Upload video + thumbnail (multipart) |
| `GET` | `/all-videos` | ✅ | Fetch all published videos |
| `PATCH` | `/update-video/:videoId` | ✅ | Update title, description, or thumbnail |
| `GET` | `/your-videos` | ✅ | Get all videos uploaded by logged-in user |
| `DELETE` | `/delete-video/:videoId` | ✅ | Delete a video (owner only) |
| `POST` | `/watch-history/:videoId` | ✅ | Add video to watch history |

---

### 📫 Subscription Routes — `/api/v1/subscriptions`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/toggle/:channelId` | ✅ | Subscribe or unsubscribe from a channel |
| `GET` | `/get-subscribers/:userId` | ✅ | Get all subscribers of a channel |
| `GET` | `/get-subscribed/:userId` | ✅ | Get all channels a user has subscribed to |

---

### 👍 Like Routes — `/api/v1/likes`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/v/:videoId` | ✅ | Toggle like on a video |
| `POST` | `/c/:commentId` | ✅ | Toggle like on a comment |
| `POST` | `/t/:tweetId` | ✅ | Toggle like on a tweet |
| `GET` | `/liked-videos` | ✅ | Get all videos liked by logged-in user |

---

### 💬 Comment Routes — `/api/v1/comments`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/v/:videoId` | ✅ | Add a comment to a video |
| `GET` | `/v/:videoId` | ❌ | Get all comments for a video |
| `PATCH` | `/c/:commentId` | ✅ | Update a comment (owner only) |
| `DELETE` | `/c/:commentId` | ✅ | Delete a comment (owner only) |

---

### 🐦 Tweet Routes — `/api/v1/tweets`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/create-tweet` | ✅ | Create a tweet with content + poster image |
| `GET` | `/all` | ❌ | Get all tweets (newest first) |
| `GET` | `/u/:UserId` | ❌ | Get all tweets by a specific user |
| `PATCH` | `/t/:tweetId` | ✅ | Update tweet content (owner only) |
| `DELETE` | `/t/:tweetId` | ✅ | Delete a tweet (owner only) |

---

### 🔍 Search Routes — `/api/v1/search`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/?query=...` | ❌ | Search videos by title or description |

---

## 🔄 Authentication Flow

```
1. Register  →  POST /api/v1/users/register
2. Login     →  POST /api/v1/users/login
                ↳ Returns accessToken + refreshToken (also set as httpOnly cookies)
3. Access protected routes with:
                ↳ Cookie: accessToken=<token>   OR
                ↳ Header: Authorization: Bearer <token>
4. Token expired?  →  POST /api/v1/users/refresh-access-token
5. Logout    →  POST /api/v1/users/logout  (clears cookies + DB refresh token)
```

---

## 🔑 Forgot Password Flow

```
1. POST /forgot-password  { emailId }
   → Generates a 6-digit OTP
   → Stores in Redis with 5-minute TTL
   → Sends OTP to the user's email

2. POST /verify-otp  { emailId, OTP }
   → Checks Redis for the stored OTP
   → Validates match

3. POST /reset-password  { emailId, newpassword }
   → Updates password in DB
   → bcrypt hashes it automatically via pre-save hook
```

---

## 📦 Response Format

All API responses follow a consistent shape:

**Success:**
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful",
  "success": true
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

---

## 🗄️ Data Models Overview

```
User          → username, email, fullName, avatar, coverImage, watchHistory[], password, refreshToken
Video         → title, description, videoFile, thumbnail, duration, views, isPublished, owner → User
Subscription  → subscriber → User, channel → User
Like          → likedBy → User, video? → Video, comment? → Comment, tweet? → Tweet
Comment       → content, video → Video, owner → User
Tweet         → content, poster (image URL), owner → User
```

---

## 🧰 Key Design Decisions

| Pattern | Description |
|---------|-------------|
| **asyncHandler** | Wraps every async controller — auto-forwards errors to Express error handler |
| **httpOnly cookies** | Access & refresh tokens stored in cookies to prevent XSS |
| **Token rotation** | Refresh token is stored in DB and cleared on logout |
| **Cloudinary temp flow** | Files saved locally by Multer → uploaded to Cloudinary → local file deleted |
| **MongoDB Aggregation** | Used for complex joins (e.g., `getChannelProfile`, `getWatchHistory`) |
| **Toggle pattern** | Like and Subscribe use findOne → delete if exists, create if not |
| **`$addToSet`** | Used for watch history to prevent duplicate video entries |
| **Redis TTL** | OTPs auto-expire after 300 seconds — no manual cleanup needed |

---

## 👨‍💻 Author

**Deepak Yadav**  
Learning Backend Development with Node.js, Express & MongoDB.


