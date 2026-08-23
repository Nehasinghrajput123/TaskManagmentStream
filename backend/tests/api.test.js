const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Board = require('../src/models/Board');
const Task = require('../src/models/Task');

let mongoServer;
let adminToken, managerToken, memberToken;
let adminUser, managerUser, memberUser;
let testProject, testBoard, testTask;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Project Management API Integration Tests', () => {

  describe('1. Authentication Module', () => {

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!',
          role: 'member',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('john@example.com');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      memberToken = res.body.data.accessToken;
      memberUser = res.body.data.user;
    });

    it('should prevent duplicate email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate John',
          email: 'john@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should register an admin and a manager user', async () => {
      const adminRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Admin User',
          email: 'admin_test@example.com',
          password: 'Password123!',
          role: 'admin',
        });
      adminToken = adminRes.body.data.accessToken;
      adminUser = adminRes.body.data.user;

      const managerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Manager User',
          email: 'manager_test@example.com',
          password: 'Password123!',
          role: 'manager',
        });
      managerToken = managerRes.body.data.accessToken;
      managerUser = managerRes.body.data.user;
    });

    it('should login user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'WrongPassword!',
        });

      expect(res.statusCode).toBe(401);
    });

    it('should refresh access token using valid refresh token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'Password123!',
        });

      const refreshToken = loginRes.body.data.refreshToken;

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should get authenticated user profile (GET /api/auth/me)', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe('john@example.com');
    });

    it('should reject unauthenticated requests to protected routes', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });

  });

  describe('2. Project Module & RBAC', () => {

    it('should allow manager to create a project', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          name: 'Mobile App Project',
          description: 'A React Native mobile application.',
          status: 'active',
          members: [memberUser._id],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Mobile App Project');
      testProject = res.body.data;
    });

    it('should list projects for project members/owner', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
    });

    it('should allow manager to add a member to the project', async () => {
      const newMember = await User.create({
        name: 'New Member',
        email: 'newmember@example.com',
        password: 'Password123!',
        role: 'member',
      });

      const res = await request(app)
        .post(`/api/projects/${testProject._id}/members`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ userId: newMember._id.toString() });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.members.some(m => m._id === newMember._id.toString())).toBe(true);
    });

  });

  describe('3. Board Module', () => {

    it('should retrieve automatically generated default board or create new board', async () => {
      const res = await request(app)
        .get(`/api/projects/${testProject._id}/boards`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      testBoard = res.body.data[0];
    });

    it('should create an extra board', async () => {
      const res = await request(app)
        .post(`/api/projects/${testProject._id}/boards`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          name: 'QA & Testing',
          description: 'Testing sprint tasks',
          position: 1,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.name).toBe('QA & Testing');
    });

  });

  describe('4. Task Module & Search/Pagination', () => {

    it('should allow project member to create a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          project: testProject._id,
          board: testBoard._id,
          title: 'Implement Push Notifications',
          description: 'Integration with FCM push notification service.',
          status: 'todo',
          priority: 'high',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          assignedTo: memberUser._id,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Implement Push Notifications');
      testTask = res.body.data;
    });

    it('should filter tasks by status and search keyword', async () => {
      const res = await request(app)
        .get(`/api/tasks?projectId=${testProject._id}&status=todo&search=Push&page=1&limit=10`)
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.total).toBe(1);
    });

    it('should update task status via PATCH endpoint and record activity', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${testTask._id}/status`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ status: 'in_progress' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('in_progress');
    });

    it('should assign task via PATCH endpoint', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${testTask._id}/assign`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ assignedTo: managerUser._id });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.assignedTo._id).toBe(managerUser._id);
    });

  });

  describe('5. Comments & Activity Log', () => {

    it('should add a comment to a task', async () => {
      const res = await request(app)
        .post(`/api/tasks/${testTask._id}/comments`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ content: 'I have started testing the push notifications API payload.' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.content).toContain('started testing');
    });

    it('should retrieve task activities history', async () => {
      const res = await request(app)
        .get(`/api/tasks/${testTask._id}/activity`)
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

  });

});
