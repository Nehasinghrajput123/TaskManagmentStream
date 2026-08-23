# Project Management Backend REST API

RESTful backend API for a project management application built with Node.js, Express.js, MongoDB, and Mongoose.

## Features

* User registration and login
* JWT authentication with access and refresh tokens
* Password hashing using bcrypt
* Role-based access for admin, manager, and member
* Project management
* Project members
* Boards and tasks
* Task assignment
* Task status updates
* Task priority and due date
* Task position updates for Kanban board
* Comments on tasks
* Task activity history
* Search, filtering, and pagination
* Request validation using Joi
* Centralized error handling
* PostMan API documentation
* Demo data seeder

## Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Joi


## Project Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/project_management_db
USE_MEMORY_DB=true
JWT_ACCESS_SECRET=tevdvebydgd
JWT_REFRESH_SECRET=qwnsyenysnkw
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development



### 4. Start the Server

For development:

```bash
npm run dev
```

Or:

```bash
npm start
```

The server will run on:

```text
http://localhost:5000
```



### 6. Run Tests

```bash
npm test
```

## API Modules

The backend includes APIs for:

* Authentication
* Users
* Projects
* Boards
* Tasks
* Comments
* Activities

## Database Models

The main MongoDB models are:

* User
* Project
* Board
* Task
* Comment
* Activity
