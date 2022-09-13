const request = require('supertest')
const app = require('../../app')

describe('Test GET /launches', () => {
  test('It adds two numbers', () => {
    expect(1 + 1).toBe(2)
  })
  test('It should respond with 200 success', async () => {
    await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200)
  })
})

describe('Test POST /launch', () => {
  test('It should respond with 201 created', async () => {
    await request(app)
      .post('/launches')
      .send({
        mission: 'USS Enterprise',
        rocket: 'ZTM Experimental IS1',
        target: 'Kepler-442 b',
        launchDate: 'January 17, 2030',
      })
      .expect('Content-Type', /json/)
      .expect(201)
  })
  test('It should catch missing required properties', () => {})
  test('It should catch invalid dates', () => {})
})
