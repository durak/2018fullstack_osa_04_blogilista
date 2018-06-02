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

  test('a valid new blog can be added', async () => {
    const newa = {
      title: 'uusi blogi',
      author: 'testman',
      url: 'abc',
      likes: 99
    }

    await api
      .post('/api/blogs')
      .send(newa)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    const body = bodyFormat(response.body)

    expect(response.body.length).toBe(dummyBlogs.length + 1)
    expect(body).toContainEqual(newa)
  })

  test('a post with no likes is added with value likes=0', async () => {
    const countBefore = (await api.get('/api/blogs')).body.length

    let newa = {
      title: 'uusi blogi',
      author: 'testman',
      url: 'abc'
    }

    let newb = {
      title: 'uusi blogi 2',
      author: 'testman 2',
      url: 'abc 2',
      likes: ''
    }

    await api
      .post('/api/blogs')
      .send(newa)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(newb)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    const body = bodyFormat(response.body)

    newa.likes = 0
    newb.likes = 0

    expect(body).toContainEqual(newa)
    expect(body).toContainEqual(newb)
    expect(body.length).toBe(countBefore + 2)

  })

  test('a blog without title or url is not added', async () => {
    const countBefore = (await api.get('/api/blogs')).body.length

    const newa = {
      author: 'testman',
      url: 'abc',
      likes: 99
    }

    const newb = {
      title: 'uusi blogi',
      author: 'testman',
      likes: 99
    }

    const newc = {
      author: 'testman',
      likes: 99
    }

    await api
      .post('/api/blogs')
      .send(newa)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(newb)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(newc)
      .expect(400)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(countBefore)
  })


})


afterAll(() => {
  server.close()
})


// Helpers

function bodyFormat(body) {
  return body.map(blog => {
    const b = { ...blog }
    delete b._id
    delete b.__v
    return b
  })
}