require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// route to about me page
app.get('/about-me', async(req,res) => {
  // load paragraphs from json data
  try{
    const aboutMe = {
      title: "About Me",
      // link to image of myself
      image: "https://i.imgur.com/8LgeWn1.jpeg",
      // paragraphs about myself
      info: [
        "Hello! My name is Kenny Buchanan. I'm 21 and a senior majoring in Computer Science. I'm from the suburbs of Denver, CO, but I was born in LA. Naturally, I love skiing, hiking, and nature of all kinds. I also devote a lot of my time to the arts; I love seeing movies, plays, and exhibitions whenever I can.",
        "My professional interests focus on human-computer interaction and UI/UX development. I love working directly with users, talking to them and understand their needs. While studying in South Korea, I got to take many user-based design classes which spurred my interest in the field. I have an interest in physical computing, and in the future, I want to work on helping to develop new accessible technologies and find new ways to make everyday life easier and more enjoyable."
      ]
    }
    res.json(aboutMe)
  }
  catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to load "About Me"',
  })
}
})

// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
