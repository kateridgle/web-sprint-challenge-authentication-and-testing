// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')
const Users = require('./auth/auth-model')

test('sanity', () => {
  expect('true').toBe('true')
})


beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})



describe('test endpoints', () => {


  test('users can get inserted', async () => {
    let result = await Users.add({ username: 'Kate', password: '2394' })
    expect(result).toEqual({ username: 'Kate', password: '2394', id: 1 })
    let users = await db('users')
    expect(users).toHaveLength(1)
})

  test('call the up endpoint', async () => {
    const result = await request(server).get('/')
    expect(result.status).toBe(200)
  })

  test('[POST] /register success', async () => {
    const post = await request(server)
      .post('/api/auth/register')
      .send({username: 'Muffin', password: '5555'
      })
    expect(post.status).toBe(201)
    const result = await Users.findById(1)
    expect(result.username).toBe('Muffin')
  })

  test('[POST] /register failure', async () => {
    let result = await request(server)
      .post('/api/auth/register')
      .send({
        username: 'Muffin'
      })
    expect(result.status).toBe(422)
  })

  test('[POST] /login success', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({
        username: 'Kate',
        password: '2394'
      })

    const result = await request(server)
      .post('/api/auth/login')
      .send({
        username: 'Kate',
        password: '2394'
      })
      expect(result.status).toBe(200)
      expect(result.body.message).toEqual('welcome, Kate')
  })

  test('[POST] /login failure', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({
        username: 'Kate',
        password: '2394'
      })

    const result = await request(server)
      .post('/api/auth/login')
      .send({
        username: 'Muffin',
        password: '5555'
      })
      expect(result.status).toBe(401)
  })
})
