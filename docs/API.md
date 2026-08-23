# REST API Documentation

This document outlines the RESTful API endpoints for the **Project Management & Collaboration Tool**.

Interactive OpenAPI/Swagger documentation is available at `/api-docs` when the backend is running.

---

## Standard Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email address"
    }
  ]
}
```

---

## Authentication Endpoints (`/api/auth`)

### 1. Register User
* **Method:** `POST`
* **Path:** `/api/auth/register`
* **Auth Required:** No
* **Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "password": "Password123!",
  "role": "member"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "60d5ecb8b5c9c22b109e99a1",
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "role": "member",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      "isActive": true
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

### 2. Login User
* **Method:** `POST`
* **Path:** `/api/auth/login`
* **Auth Required:** No
* **Body:**
```json
{
  "email": "alex@example.com",
  "password": "Password123!"
}
```

### 3. Refresh Access Token
* **Method:** `POST`
* **Path:** `/api/auth/refresh`
* **Auth Required:** No
* **Body:**
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

### 4. Logout User
* **Method:** `POST`
* **Path:** `/api/auth/logout`
* **Auth Required:** Yes (Bearer Token)

### 5. Get Current Authenticated User
* **Method:** `GET`
* **Path:** `/api/auth/me`
* **Auth Required:** Yes (Bearer Token)

---

## Projects Endpoints (`/api/projects`)

### 1. List Projects
* **Method:** `GET`
* **Path:** `/api/projects?status=active&search=website&page=1&limit=10`
* **Auth Required:** Yes

### 2. Create Project
* **Method:** `POST`
* **Path:** `/api/projects`
* **Auth Required:** Yes
* **Body:**
```json
{
  "name": "Poject Name",
  "description": "Description website",
  "status": "active",
  "members": ["60d5ecb8b5c9c22b109e99a2"]
}
```

### 3. Get Single Project
* **Method:** `GET`
* **Path:** `/api/projects/:id`

### 4. Update Project
* **Method:** `PUT`
* **Path:** `/api/projects/:id`

### 5. Delete Project
* **Method:** `DELETE`
* **Path:** `/api/projects/:id`

### 6. Add Project Member
* **Method:** `POST`
* **Path:** `/api/projects/:id/members`
* **Body:** `{ "userId": "60d5ecb8b5c9c22b109e99a2" }`

### 7. Remove Project Member
* **Method:** `DELETE`
* **Path:** `/api/projects/:id/members/:userId`

---

## Boards Endpoints (`/api/boards`)

### 1. List Project Boards
* **Method:** `GET`
* **Path:** `/api/projects/:projectId/boards`

### 2. Create Board
* **Method:** `POST`
* **Path:** `/api/projects/:projectId/boards`
* **Body:** `{ "name": "In Progress", "description": "Active sprint board", "position": 1 }`

### 3. Update / Delete Board
* **Method:** `PUT` / `DELETE`
* **Path:** `/api/boards/:id`

---

## Tasks Endpoints (`/api/tasks`)

### 1. Get Dashboard Statistics
* **Method:** `GET`
* **Path:** `/api/tasks/dashboard/stats`

### 2. List Tasks (Search & Filters)
* **Method:** `GET`
* **Path:** `/api/tasks?projectId=123&status=todo&priority=high&assignedTo=456&search=auth&page=1&limit=10`

### 3. Create Task
* **Method:** `POST`
* **Path:** `/api/tasks`
* **Body:**
```json
{
  "project": "60d5ecb8b5c9c22b109e99a1",
  "board": "60d5ecb8b5c9c22b109e99a5",
  "title": "Fix Authentication Bug",
  "description": "Tokens expiring prematurely",
  "status": "todo",
  "priority": "urgent",
  "dueDate": "2026-09-01T00:00:00.000Z",
  "assignedTo": "60d5ecb8b5c9c22b109e99a2"
}
```

### 4. Patch Status / Assign / Position
* **PATCH** `/api/tasks/:id/status` -> `{ "status": "in_progress" }`
* **PATCH** `/api/tasks/:id/assign` -> `{ "assignedTo": "60d5ecb8b5c9c22b109e99a2" }`
* **PATCH** `/api/tasks/:id/position` -> `{ "board": "...", "position": 2, "status": "done" }`

---

## Comments & Activities

* **GET** `/api/tasks/:taskId/comments`
* **POST** `/api/tasks/:taskId/comments` -> `{ "content": "Great work on this task!" }`
* **PUT / DELETE** `/api/comments/:id`
* **GET** `/api/tasks/:taskId/activity`
