# Background Jobs Strategy Architecture

This document describes how background asynchronous jobs and queue processing can be integrated using **BullMQ** + **Redis**.

## Recommended Background Job Workflows

```text
[ Express API ] ──► Dispatch Job ──► [ Redis Queue (BullMQ) ]
                                             │
                                             ▼
                                    [ Dedicated Worker Process ]
                                             │
                                ┌────────────┴────────────┐
                                ▼                         ▼
                     [ Send Email Reminders ]   [ Process Cleanup / Analytics ]
```

### 1. Due-Date & Overdue Task Reminders
- **Frequency:** Scheduled Cron job (e.g. daily at 08:00 AM)
- **Job:** Scans tasks with `dueDate` approaching within 24 hours or past due, enqueues email notification jobs for assignees.

### 2. Project Member Invitation Emails
- **Trigger:** Immediate background job when `POST /api/projects/:id/members` is invoked.
- **Job:** Renders email template and dispatches via SMTP / AWS SES / SendGrid.

### 3. Real-Time Activity Digest Notifications
- **Trigger:** Batching task activity changes (comment added, status changed).
- **Job:** Sends hourly digest emails to project owners summarizing recent team changes.

### 4. Database Audit Cleanup Jobs
- **Frequency:** Weekly cron job.
- **Job:** Purges orphaned activity logs older than 90 days or soft-deleted records.

## Architecture & Code Sample (BullMQ + Redis)

```javascript
const { Queue, Worker } = require('bullmq');

// Queue instance
const emailQueue = new Queue('email-notifications', {
  connection: { host: 'localhost', port: 6379 }
});

// Enqueue job in controller
await emailQueue.add('sendDueReminder', {
  userEmail: user.email,
  taskTitle: task.title,
  dueDate: task.dueDate
});

// Worker process
const worker = new Worker('email-notifications', async (job) => {
  if (job.name === 'sendDueReminder') {
    await sendEmail(job.data);
  }
}, { connection: { host: 'localhost', port: 6379 } });
```
