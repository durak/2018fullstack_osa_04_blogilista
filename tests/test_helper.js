const Blog = require('../models/blog')

const format = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}

const blogsInDb = async () => {
  const b = await Blog.find({})
  return b.map(format)
}

const blogsFromResponse = (response) => {
  return response.body.map(n => format(n))
}

const nonExistingId = async () => {
  const n = new Blog()
  await n.save()
  const id = n._id
  await n.remove()
  return id
}


module.exports = {
  format, blogsInDb, nonExistingId, blogsFromResponse
}

