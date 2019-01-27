const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  next({ status: 404, error: "Not found" })
})

module.exports = router
