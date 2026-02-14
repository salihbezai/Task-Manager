# 🚀 Task Manager – Full-Stack Application

A modern **full-stack Task Manager application** built with **React + TypeScript + Redux Toolkit** on the frontend and **Node.js + Express + MongoDB** on the backend.

The application allows users to authenticate, create and manage tasks, assign tasks to multiple users, manage todos and attachments, and track task status in real time.

This project follows clean architecture principles, normalized state management, and strong TypeScript typing.

---

## ✨ Features

### 🔐 Authentication
- Users can register and login to the application.  
- Access tokens are short-lived JSON Web Tokens (JWT) used to protect backend routes.  
- Refresh tokens are used to issue new access tokens without requiring the user to log in again. Each refresh token is rotated after use, and the old token expires after a    short grace period to prevent replay attacks.  
- Certain backend API routes require a valid access token to access.  
- Frontend routes are protected based on authentication and user roles (e.g., admin vs. user).  

### 📋 Task Management
- Create, read, update, delete tasks
- Assign tasks to multiple users
- Task status and priority management
- Due date handling
- Todos inside each task
- Attachments (URL links)
- Task progress tracking

### 👥 User Management
- Fetch and display users
- Assign users to tasks via modal UI
- Avatar preview for assigned users

### ⚡ Frontend Experience
- Redux Toolkit for global state management
- Async thunks for API calls
- Loading indicators and toast notifications
- Modal dialogs for confirmations and user assignment
- Responsive UI using TailwindCSS

### 🛡️ Backend
- REST API built with Express + TypeScript
- MongoDB with Mongoose schemas and relations
- JWT authentication middleware
- Password hashing with bcrypt
- Centralized error logging using Winston

---

## 🧰 Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt
- Winston Logger

### Frontend
- React
- TypeScript
- Redux Toolkit
- React Router
- Axios
- TailwindCSS
- React Toastify
- React Icons

---

## 🏗️ Project Architecture

### Backend
- REST API with controllers and services
- Mongoose schemas with relations (Task → Users)
- Middleware for authentication and error handling
- Environment-based configuration

### Frontend
- Redux normalized state
- Async actions using createAsyncThunk
- Local component state for forms only
- Derived data using memoized selectors
- Strong TypeScript typing for payloads and API responses

---

## Installation

### Backend

1. Navigate to the backend folder:

```bash

cd backend

```

2.Install dependencies:

```bash

npm install

```
3.Create a .env file:

```bash

PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>

```

4.Run the server:

```bash

npm run dev

```

### Frontend

```bash

cd frontend
npm install
npm run dev
```


### 🧪 Tests

The project includes automated backend tests to ensure the application works as expected.  

#### What is tested
- Controllers, services, and utility functions.  
- Authentication flows:
  - User registration and login  
  - Access token validation  
  - Refresh token rotation and expiration  
- Protected routes to verify that only authorized users can access them.  
- Error handling for invalid requests and unauthorized access.  

#### Running Tests
```bash
npm run test

## 📬 Contact

- GitHub: [salihbezai](https://github.com/salihbezai)
- Email: salihbezai98@gmail.com


