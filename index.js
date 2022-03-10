/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const cors = require('cors')
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");


const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

//GUUGEL
app.use(session({
  secret: 'Our little secret.',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.authenticate('session'))

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(result => {
  console.log('connected to MongoDB @', result.connection.host)
})
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy())

passport.serializeUser(function (user, done) {
  done(null, user.id);
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  })
})

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:3001/auth/google/callback',
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id, username: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
)

app.get("/auth/google/callback",
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
  function (req, res) {
    // Successful authentication, redirect secrets.
    console.log('Google auth success')
    res.redirect('http://localhost:3001')
  })

app.get('/logout', function (req, res) {
  console.log('logout')
  req.logout()
  res.redirect('http://localhost:3000/')
})

app.get('/', (request, response) => {
  response.send('<h1>You are now logged. Hopefully</h1>')
})

app.get('/api/users', (request, response) => {
  User.find({}).then(users => {
    response.json(users)
  })
})

app.get('/api/users/:id', (request, response, next) => {
  User.findById(request.params.id).then(user => {
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.put('/api/users/:id', (request, response, next) => {
  const { content, important } = request.body

  const user = {
    content: body.content,
    important: body.important,
  }

  User.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedUser => {
      response.json(updatedUser)
    })
    .catch(error => next(error))
})

app.delete('/api/users/:id', (request, response) => {
  const id = Number(request.params.id)
  users = users.filter(user => user.id !== id)

  response.status(204).end()
})
const generateId = () => {
  const maxId = users.length > 0
    ? Math.max(...users.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/users', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const user = new User({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  user.save().then(savedUser => {
    response.json(savedUser)
  })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)