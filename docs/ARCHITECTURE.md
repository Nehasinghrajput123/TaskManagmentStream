# Architecture Overview

This document describes the design architecture, security controls, and design patterns used in the **Project Management & Collaboration Tool**.

## High-Level System Architecture

```text
 Client (Browser / React SPA)
            │
            │ HTTP/HTTPS (REST API + JWT Bearer)
            ▼
    Express.js Web Server
 ┌────────────────────────────────────────┐
 │ Middlewares (Helmet, CORS, RateLimit)  │
 ├────────────────────────────────────────┤
 │ Route Layer                            │
 ├────────────────────────────────────────┤
 │ Validation Layer (Joi Schemas)         │
 ├────────────────────────────────────────┤
 │ Controller Layer (HTTP Handling)       │
 ├────────────────────────────────────────┤
 │ Service Layer (Business Logic & RBAC)  │
 ├────────────────────────────────────────┤
 │ Model Layer (Mongoose Schemas)         │
 └────────────────────────────────────────┘
            │
            ▼
    MongoDB Storage Layer
```

## Backend Layer Responsibilities

1. **Route Layer (`src/routes`)**: Maps HTTP verbs and URI paths to middleware stacks and controllers. Keeps routes lean without embedding business rules.
2. **Middleware Layer (`src/middleware`)**: Handles cross-cutting concerns:
   - `authMiddleware.js`: Token verification & RBAC role authorization (`admin`, `manager`, `member`).
   - `validateMiddleware.js`: Input validation against Joi schemas.
   - `errorMiddleware.js`: Centralized error catching and formatted standard error responses.
   - `rateLimiter.js`: Protects authentication endpoints against brute force attacks.
3. **Controller Layer (`src/controllers`)**: Reads requests, passes payload to services, and returns formatted responses via `sendSuccess` or `sendPaginated`.
4. **Service Layer (`src/services`)**: Enforces business logic, domain invariants, activity tracking, and project access rights.
5. **Model Layer (`src/models`)**: Defines MongoDB collections, schemas, indexes, schema hooks (e.g. password hashing), and instance methods.

## Security Architecture

- **Password Security**: Passwords are hashed using `bcryptjs` with salt factor 10. Passwords are set with `select: false` in Mongoose schemas to avoid accidental inclusion in API responses.
- **JWT Authentication**: Short-lived Access Tokens (15m) paired with long-lived Refresh Tokens (7d).
- **Role-Based Access Control (RBAC)**:
  - `admin`: Full system read/write access.
  - `manager`: Project creation, board & member management, task assignment.
  - `member`: Access restricted to assigned/joined projects, task creation & status updates.
- **HTTP Security Headers**: `helmet` enforces security headers (XSS Filter, HSTS, Sniff protections).
- **CORS Protection**: Restricts requests to configured `CLIENT_URL`.
