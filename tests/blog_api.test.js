const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const dummyBlogs = require('./blogs_test_data')
const { format, blogsInDb, nonExistingId, blogsFromResponse, getUser } = require('./test_helper')

describe('When there is initially some blogs saved:', () => {
  beforeAll(async () => {
    await Blog.remove({})
    await User.remove({})

    const blogs = dummyBlogs.map(blog => new Blog(blog))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
  })

  test('all blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()
    const blogsFromApi = blogsFromResponse(
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    )

    for (let blog of blogsInDatabase) {
      expect(blogsFromApi).toContainEqual(blog)
    }

    expect(blogsFromApi.length).toBe(blogsInDatabase.length)
  })

  test('individual blogs are returned as JSON by GET /api/blogs/:id', async () => {
    // to be added
  })

  test('404 returned by GET /api/blogs/:id with nonexisting valid id', async () => {
    // to be added
  })

  test('400 is returned by GET /api/blogs/:id with invalid id', async () => {
    // to be added
  })

  describe('addition of a new blog', async () => {
    let user
    beforeEach(async () => {
      await User.remove({})
      user = await getUser('successman', 'success', 'password')
    })


    test('POST /api blogs succeeds with valid data', async () => {
      const countBefore = (await blogsInDb()).length
      const newa = {
        title: 'uusi blogi',
        author: 'testman',
        url: 'abc',
        likes: 99
      }

      const response = await post('/api/blogs', newa, user.token, 201)

      const blogsAfter = await blogsInDb()

      expect(JSON.stringify(response.body.user)).toContain(user._id)
      expect(blogsAfter.length).toBe(countBefore + 1)
      expect(blogsAfter).toContainEqual(newa)
    })

    test('POST /api/blogs with field likes missing succeeds with value likes=0', async () => {
      const countBefore = (await blogsInDb()).length

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

      await post('/api/blogs', newa, user.token, 201)
      await post('/api/blogs', newb, user.token, 201)

      const blogsAfter = await blogsInDb()

      newa.likes = 0
      newb.likes = 0

      expect(blogsAfter).toContainEqual(newa)
      expect(blogsAfter).toContainEqual(newb)
      expect(blogsAfter.length).toBe(countBefore + 2)
    })

    test('POST /api/blogs fails with proper statuscode if title or url is missing', async () => {
      const countBefore = (await blogsInDb()).length
      const invalidBlogs = [
        { author: 'testman', url: 'abc', likes: 99 },
        { title: 'uusi blogi', author: 'testman', likes: 99 },
        { author: 'testman', likes: 99 }
      ]

      for (let blog of invalidBlogs) {
        await post('/api/blogs', blog, user.token, 400)
      }

      const blogsAfter = await blogsInDb()

      expect(blogsAfter.length).toBe(countBefore)
    })

  })

  describe('deletion of a blog', async () => {
    let addedBlog

    beforeAll(async () => {
      addedBlog = new Blog({
        author: 'deleteman',
        title: 'poisto pyynnöllä HTTP DELETE',
        url: 'del',
        likes: 333
      })
      await addedBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
      const blogsBefore = await blogsInDb()

      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .expect(204)

      const blogsAfterOperation = await blogsInDb()

      const contents = blogsAfterOperation.map(r => r.title)

      expect(contents).not.toContain(addedBlog.title)
      expect(blogsAfterOperation.length).toBe(blogsBefore.length - 1)
    })

  })

  describe('updating a blog', async () => {
    let newBlog

    beforeAll(async () => {
      newBlog = new Blog({
        author: 'old putman',
        title: 'old title',
        url: 'old url',
        likes: 1
      })
      await newBlog.save()
    })

    test('PUT /api/blogs/:id succeeds with valid partial data', async () => {
      const updates = [
        { author: 'new author' },
        { title: 'new title' },
        { url: 'new url' },
        { likes: 99 }
      ]

      for (let update of updates) {
        await put('/api/blogs/', newBlog._id, update, 200)
      }

      const fromDB = format(await Blog.findById(newBlog._id))
      expect(fromDB.author).toContain('new author')
    })

    test('PUT /api/blogs/:id succeeds with valid full data', async () => {
      const update = {
        title: 'new title 2',
        author: 'new author 2',
        url: 'new url 2',
        likes: 66
      }

      await put('/api/blogs/', newBlog._id, update, 200)

      const fromDB = format(await Blog.findById(newBlog._id))
      expect(fromDB.author).toContain('new author 2')
    })

    test('PUT /api/blogs/:id fails with invalid data', async () => {
      await put('/api/blogs/', newBlog._id, {}, 400)
      await put('/api/blogs/', newBlog._id, { invalid:'something' }, 400)
    })
  })

  afterAll(() => {
    server.close()
  })
})

async function post(path, obj, token, statusExpected) {
  const response =  await api
    .post(path)
    .set('Authorization', 'bearer ' + token)
    .send(obj)
    .expect(statusExpected)
    .expect('Content-Type', /application\/json/)

    
  return response
}

async function put(path, id, obj, statusExpected) {
  await api
    .put(`${path}${id}`)
    .send(obj)
    .expect(statusExpected)
    .expect('Content-Type', /application\/json/)
}



