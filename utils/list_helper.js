const dummy = (blogs) => {
  let use = blogs
  use = 1
  return use
}

const totalLikes = (blogs) => {
  const reducer = (likesSum, blog) => likesSum + blog.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, current) => {
    return prev.likes > current.likes ? prev : current
  }

  return blogs.reduce(reducer, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}