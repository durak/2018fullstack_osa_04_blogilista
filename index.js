const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')


mongoose
  .connect(config.mongoUrl)
  .then( () => {
    let uri = config.mongoUrl.substring(config.mongoUrl.indexOf('@') + 1, config.mongoUrl.length)
    console.log('connected to database', uri)
  })
  .catch( err => {
    console.log(err)
  })


app.use(cors())
app.use(bodyParser.json())
// static
// logger middleware

// routemäärittelyt
app.use('/api/blogs', blogsRouter)

// error middleware

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}

/* const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) */