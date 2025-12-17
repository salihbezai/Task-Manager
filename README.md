# Task Manager Full-Stack Application

This is a **full-stack Task Manager** application built with **React** (frontend) and **Node.js + Express + TypeScript + MongoDB** (backend).  
It allows users to register, login, create and manage tasks, assign tasks to multiple users, track progress, attach files, and maintain todos.

---

## Technologies Used

**Backend:**
- Node.js, Express
- TypeScript
- MongoDB (Mongoose)
- JWT authentication
- Bcrypt for password hashing
- Winston for structured error logging

**Frontend:**
- React
- TypeScript
- Axios for API calls
- TailwindCSS (optional, or any CSS framework)
- JWT-based auth handling (store token in localStorage or cookies)

---

## Features

- **User Authentication**
  - Register & login
  - JWT-based session management
- **Task Management**
  - CRUD operations for tasks
  - Assign tasks to multiple users
  - Track progress and todos
  - Attach files (links)
- **Protected Routes**
  - Auth middleware for backend routes
  - Frontend handles route guards based on auth state
- **Error Handling**
  - Backend logs errors in a file and console
  - Frontend displays user-friendly messages

---


---

## Installation

### Backend

1. Navigate to the backend folder:

```bash
cd backend


2.Install dependencies:

npm installs

3.Create a .env file:

PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>

4.Run the server:
npm run dev
