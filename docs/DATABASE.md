# Database Design & Schema Documentation

The application uses **MongoDB** with **Mongoose ODM**.

## Schema Models & Relationships

```text
User ─────────────┬─────────────► Project (owner, members)
                  │                  │
                  │                  ├─────────────► Board
                  │                  │                 │
                  ▼                  ▼                 ▼
             Activity ◄────────── Task ◄────────── Comment
```

### 1. User Model (`users`)
- `_id`: ObjectId (PK)
- `name`: String, required
- `email`: String, required, unique, indexed
- `password`: String, select: false
- `role`: Enum `['admin', 'manager', 'member']`
- `avatar`: String
- `isActive`: Boolean
- `refreshToken`: String, select: false
- `createdAt`, `updatedAt`: Date

### 2. Project Model (`projects`)
- `_id`: ObjectId (PK)
- `name`: String, required
- `description`: String
- `owner`: ObjectId ref `User`, indexed
- `members`: Array of ObjectId ref `User`
- `status`: Enum `['active', 'completed', 'archived']`, indexed
- `createdAt`, `updatedAt`: Date

**Compound Index:** `{ owner: 1, name: 1 }`

### 3. Board Model (`boards`)
- `_id`: ObjectId (PK)
- `project`: ObjectId ref `Project`, indexed
- `name`: String, required
- `description`: String
- `position`: Number
- `createdAt`, `updatedAt`: Date

**Compound Index:** `{ project: 1, position: 1 }`

### 4. Task Model (`tasks`)
- `_id`: ObjectId (PK)
- `project`: ObjectId ref `Project`, indexed
- `board`: ObjectId ref `Board`, indexed
- `title`: String, required
- `description`: String
- `status`: Enum `['todo', 'in_progress', 'done']`, indexed
- `priority`: Enum `['low', 'medium', 'high', 'urgent']`, indexed
- `dueDate`: Date, indexed
- `assignedTo`: ObjectId ref `User`, indexed
- `createdBy`: ObjectId ref `User`
- `position`: Number
- `createdAt`, `updatedAt`: Date

**Indexes:**
- `{ project: 1, status: 1 }`
- `{ board: 1, position: 1 }`

### 5. Comment Model (`comments`)
- `_id`: ObjectId (PK)
- `task`: ObjectId ref `Task`, indexed
- `user`: ObjectId ref `User`
- `content`: String, required
- `createdAt`, `updatedAt`: Date

### 6. Activity Model (`activities`)
- `_id`: ObjectId (PK)
- `task`: ObjectId ref `Task`, indexed
- `user`: ObjectId ref `User`
- `action`: String (e.g. 'Task created', 'Status changed', 'Task assigned')
- `oldValue`: String
- `newValue`: String
- `metadata`: Object
- `createdAt`: Date
