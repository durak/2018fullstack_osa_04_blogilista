const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const dummyBlogs = require('./blogs').blogs


beforeAll(async () => {
  await Blog.remove({})

  const blogs = dummyBlogs.map(blog => new Blog(blog))
  const promises = blogs.map(blog => blog.save())
  await Promise.all(promises)
})

describe('API tests:', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs and nothing else is returned', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(dummyBlogs.length)

    for (let blog of dummyBlogs) {
      expect(response.body).toContainEqual(blog)
    }
  })

})

afterAll(() => {
  server.close()
})