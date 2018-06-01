const listHelper = require('../utils/list_helper')
const dummyBlogs = require('./blogs').blogs

test('dummy is called', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [dummyBlogs[0]]
  const listWithManyBlogs = dummyBlogs

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(7)
  })

  test('of list with many blogs is calculated correctly', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog is', () => {
  const listWithOneBlog = [dummyBlogs[0]]
  const listWithManyBlogs = dummyBlogs

  test('an empty object when list has no blogs', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

  test('the only blog in a list of one blogs', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(dummyBlogs[0])
  })

  test('the blog with most likes in a list of many blogs', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    expect(result).toEqual(dummyBlogs[2])
  })

})