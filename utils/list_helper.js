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

const mostBlogs = (blogs) => {
  const reducer = (titleCount, blog) => {
    titleCount[blog.author] = (titleCount[blog.author] || 0) + 1
    return titleCount
  }
  const sortedAuthors = blogs.reduce(reducer, [])

  const topAuthor = Object.keys(sortedAuthors).reduce((prev, next) => {
    return sortedAuthors[prev] > sortedAuthors[next] ? prev : next
  }, {})

  if (!sortedAuthors[topAuthor]) {
    return {}
  }

  return {
    author: topAuthor,
    blogs: sortedAuthors[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}