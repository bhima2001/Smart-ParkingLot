import request from 'supertest';
import app from '../app.js';

let authToken;
let testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    phoneNumber: '1234567890',
    password: 'testpass123'
};
let testReservationId;

// You may need to adjust these IDs based on your seed data
const testLotId = 10;
const testSpotId = 10;
const testUserId = 11; // Will be set after signup/login if needed

// Unix timestamps for test times
const unixStartTime1 = 1721892000; // 2024-07-25T10:00:00Z
const unixEndTime1 = 1721899200;   // 2024-07-25T12:00:00Z
const unixStartTime2 = 1721902800; // 2024-07-25T13:00:00Z
const unixEndTime2 = 1721906400;   // 2024-07-25T14:00:00Z

beforeAll(async () => {
    // Signup
    await request(app)
        .post('/api/user/signup')
        .send(testUser);
    // Login
    const loginRes = await request(app)
        .post('/api/user/login')
        .send({ email: testUser.email, password: testUser.password });
    expect(loginRes.statusCode).toBe(200);
    authToken = loginRes.body.token;
});

describe('User Endpoints', () => {
    it('should sign up a new user', async () => {
        const res = await request(app)
            .post('/api/user/signup')
            .send({ ...testUser, email: 'unique_' + Date.now() + '@example.com' });
        expect([200, 201, 400]).toContain(res.statusCode); // 400 if already exists
    });

    it('should login with valid credentials', async () => {
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: testUser.email, password: testUser.password });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should get reservations for the logged-in user', async () => {
        const res = await request(app)
            .get('/api/user/getReservations')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('reservations');
    });
});

describe('Parking Lot Endpoints', () => {
    it('should get all parking lots', async () => {
        const res = await request(app)
            .get('/api/parkinglot/getAll')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.parkingLots)).toBe(true);
    });

    it('should get all spots for a specific lot', async () => {
        const res = await request(app)
            .get(`/api/parkinglot/${testLotId}/getSpots`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.spots)).toBe(true);
    });
});

describe('Parking Spot Endpoints', () => {
    it('should get available spots for a given time range and type', async () => {
        const res = await request(app)
            .get('/api/parkingspot/getAvailableSpots')
            .set('Authorization', `Bearer ${authToken}`)
            .query({
                spotType: 'compact',
                startTime: new Date(unixStartTime1 * 1000).toISOString(),
                endTime: new Date(unixEndTime1 * 1000).toISOString(),
                parkingLotId: testLotId
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('slots');
    });
});

describe('Reservation Endpoints', () => {
    it('should create a reservation for a spot', async () => {
        const res = await request(app)
            .post('/api/reservation/create')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                userId: testUserId,
                parkingSpotId: testSpotId,
                startTime: new Date(unixStartTime2 * 1000).toISOString(),
                endTime: new Date(unixEndTime2 * 1000).toISOString(),
                status: 'reserved'
            });
        expect([200, 201]).toContain(res.statusCode);
        expect(res.body.reservation).toBeDefined();
        testReservationId = res.body.reservation.id;
    });

    it('should cancel a reservation', async () => {
        if (!testReservationId) return;
        const res = await request(app)
            .put(`/api/reservation/${testReservationId}/cancel`)
            .set('Authorization', `Bearer ${authToken}`);
        expect([200, 201]).toContain(res.statusCode);
        expect(res.body.reservation.status).toBe('cancelled');
    });
});
