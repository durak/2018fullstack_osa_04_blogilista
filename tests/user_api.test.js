const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { format, blogsInDb, nonExistingId, blogsFromResponse, getUser, usersInDb } = require('./test_helper')

describe('when some users initially exist', async () => {
  let user1
  let user2

  beforeAll(async () => {
    await User.remove({})
    user1 = await getUser('username1', 'user1', 'password')
    user2 = await getUser('username2', 'user2', 'password')

  })

  describe('addition of a new user', async () => {
    test('POST /api/users succeeds with valid data', async () => {
      const usersBefore = await usersInDb()

      let newUser = {
        username: 'newUsername',
        name: 'newName',
        adult: false,
        password: 'secret'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      newUser._id = response.body.id
      newUser = User.format(newUser)

      const usersAfter = await usersInDb()

      expect(usersAfter.length).toBe(usersBefore.length + 1)
      expect(usersAfter).toContainEqual(newUser)
    })

    test('POST /api/users defaults to adult user', async () => {
      let newUser = {
        username: 'newUsernameDefaultAdult',
        name: 'newNameDefaultAdult',
        password: 'secret'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const dbUser = await User.findOne({ _id: response.body.id })
      expect(dbUser.adult).toBe(true)
    })

    test('POST /api/users fails with username < 3 characters', async () => {
      const usersBefore = await usersInDb()

      let newUser = {
        username: 'aa',
        name: 'tooshortusername',
        password: 'secret'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)


      const usersAfter = await usersInDb()
      expect(usersBefore.length).toBe(usersAfter.length)
      expect(response.body.error).toEqual('username must be at least 3 char long')
    })

    test('POST /api/users fails with username already taken', async () => {
      const usersBefore = await usersInDb()

      let newUser = {
        username: user1.username,
        name: 'name',
        password: 'secret'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)


      const usersAfter = await usersInDb()
      expect(usersBefore.length).toBe(usersAfter.length)
      expect(response.body.error).toEqual('username must be unique')
    })


  })
  afterAll(() => {
    server.close()
  })
})