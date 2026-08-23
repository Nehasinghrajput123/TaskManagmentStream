# Caching Strategy Architecture

This document details how **Redis** can be introduced as a high-performance caching layer for the Project Management application.

## Why Redis Caching?

As the application grows, read operations on dashboard statistics, project listings, and task boards frequently execute similar MongoDB queries. A Redis caching layer reduces database load and achieves sub-10ms API responses.

```text
[ Client ] ──► [ Express Server ] ──► [ Redis Cache ] ──(Cache Miss)──► [ MongoDB ]
                                            │                                 │
                                            └◄────── Store Cache Entry ───────┘
```

## Recommended Redis Use Cases

### 1. Dashboard Overview Statistics
- **Key pattern:** `cache:dashboard:user:<userId>`
- **TTL:** 60 seconds (or write-through invalidation)
- **Rationale:** Dashboard aggregation runs multiple `countDocuments` queries. Caching eliminates repetitive aggregations on frequent page refreshes.

### 2. Frequently Accessed Project Listings
- **Key pattern:** `cache:projects:user:<userId>:page:<page>`
- **TTL:** 300 seconds (5 minutes)
- **Invalidation:** Triggered on `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`.

### 3. Board & Kanban Task Lists
- **Key pattern:** `cache:tasks:project:<projectId>:board:<boardId>`
- **TTL:** 120 seconds
- **Invalidation:** Triggered when tasks are created, moved, or updated via Kanban drag-and-drop.

## Implementation Blueprint (Node.js + `ioredis`)

```javascript
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const getOrSetCache = async (key, ttlInSeconds, fetchFn) => {
  const cachedData = await redis.get(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const freshData = await fetchFn();
  await redis.set(key, JSON.stringify(freshData), 'EX', ttlInSeconds);
  return freshData;
};
```

## Why Excluded from Core v1 Build
To maintain zero external system dependencies (such as local Redis daemons) during initial evaluation while supporting out-of-the-box local execution, Redis integration is architected as an optional pluggable layer.
