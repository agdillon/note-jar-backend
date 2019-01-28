const express = require('express')
const router = express.Router()
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
  bcrypt.hash(password, saltRounds, (err, hash) => {
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

    // generate friend code - TODO
    const code = phone.slice(0, 7)

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
            res.json(user[0])
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
      // validate password and send 401 if invalid - TODO
      // check hash of pw against hashed_password
      bcrypt.compare(password, user.hashed_password, (err, res) => {
        if (res) {
          // if good generate and send back jwt - TODO
        }
        else {
          next({ status: 401, message: 'Incorrect password'})
        }
      })
    })
})

module.exports = router
