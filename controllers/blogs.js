const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {

    if (!request.body.title || !request.body.url) {
      return response.status(400).json({ error: 'content missing' })
    }

    if (request.body.likes === undefined || request.body.likes === '') {
      request.body.likes = 0
    }

    const blog = new Blog(request.body)
    const savedBlog = await blog
      .save()

    response.status(201).json(savedBlog)
  } catch (exception) {

    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()

  } catch (exception) {

    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {

    const body = request.body

    if (body.author === undefined
      && body.title === undefined
      && body.url === undefined
      && body.likes === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const updated = await Blog
      .findByIdAndUpdate(request.params.id, body, { new: true })
    response.status(200).json(updated)
  } catch (exception) {

    console.log(exception)
    return response.status(400).json({ error: 'content missing' })
  }
})

module.exports = blogsRouter