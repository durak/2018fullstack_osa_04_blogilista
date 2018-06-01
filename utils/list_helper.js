const dummy = (blogs) => {
  let use = blogs
  use = 1
  return use
}

const totalLikes = (blogs) => {  
  const reducer = (likesSum, blog) => likesSum + blog.likes

  return blogs.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes
}