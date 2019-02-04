const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const knex = require('../knex')

const saltRounds = 10
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// POST a new user / registration
router.post('/register', (req, res, next) => {
  let {
    email,
    password,
    phone,
    daily_method,
    daily_time
  } = req.body

  // password validations - TODO
  bcrypt.hash(password, saltRounds, (err, hashed_password) => {
    if (err) {
      return next(err)
    }
    if (phone) {
      // remove anything that's not a digit from phone number and validate length
      phone = phone.replace(/\D/g, '')
      if (phone.length !== 10) {
        return next({ status: 400, message: 'Invalid phone number' })
      }
    }

    // validate email
    if (!email.match(emailRegex)) {
      return next({ status: 400, message: 'Invalid email' })
    }

    if (daily_method) {
      // validate daily_method
      const methods = ['email', 'SMS', 'push']
      if (!methods.includes(daily_method)) {
        return next({ status: 400, message: 'Invalid daily method (must be email, SMS, or push)' })
      }
    }

    // validate daily_time - TODO

    // generate friend code
    const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890'
    const code = Array(7).join().split(',').map(() => alphabet.charAt(Math.floor(Math.random() * alphabet.length))).join('')
    // need to redo this to avoid collisions - uuid or something? - TODO

    const newUser = {
      email,
      hashed_password,
      phone,
      code,
      daily_method,
      daily_time
    }

    knex('users')
      .where('email', newUser.email)
      .first()
      .then(user => {
        if (user) {
          return next({ status: 400, message: 'Duplicate email' })
        }

        knex('users')
          .insert(newUser)
          .returning(['id', 'email', 'phone', 'code', 'daily_method', 'daily_time'])
          .then(user => {
            jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' }, (jwtErr, signedJwt) => {
              if (jwtErr) {
                return next(jwtErr)
              }
              res.json({ jwt: signedJwt, user })
            })
          })
          .catch(err => {
            next(err)
          })
      })
      .catch(err => {
        next(err)
      })
  })
})

// POST a login
router.post('/login', (req, res, next) => {
  let { email, password } = req.body
  // get hashed password from database
  knex('users')
    .where('email', email)
    .first()
    .then(user => {
      if (!user) {
        return next({ status: 401, message: 'Incorrect email or password' })
      }

      // validate password and send 401 if invalid - TODO
      bcrypt.compare(password, user.hashed_password, (err, match) => {
        if (err) {
          return next(err)
        }
        else if (match) {
          jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' }, (jwtErr, signedJwt) => {
            if (jwtErr) {
              return next(jwtErr)
            }
            const userToSend = {
              id: user.id,
              email: user.email,
              phone: user.phone,
              code: user.code,
              daily_method: user.daily_method,
              daily_time: user.daily_time
            }
            res.json({ jwt: signedJwt, user: userToSend })
          })
        }
        else {
          return next({ status: 401, message: 'Incorrect email or password' })
        }
      })
    })
})

module.exports = router
