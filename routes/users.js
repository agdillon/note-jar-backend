const express = require('express')
const router = express.Router()
const knex = require('../knex')

// GET one user
router.get('/:id', (req, res, next) => {
  res.send('GET a user')
})

// POST a new user
router.post('/', (req, res, next) => {
  res.send('POST a user')
})

// PATCH a user
router.patch('/:id', (req, res, next) => {
  res.send('PATCH a user')
})

// GET all notes for user
router.get('/:id/notes', (req, res, next) => {
  knex('notes')
    .leftJoin('note_tags', 'notes.id', 'note_id')
    .innerJoin('tags', 'tags.id', 'tag_id')
    .select(['author', 'content', 'notes.created_at', 'note_id', 'type', 'user_id', knex.raw('ARRAY_AGG(tag_name) as tag_name')])
    .where('user_id', req.params.id)
    .groupBy('author', 'content', 'notes.created_at', 'note_id', 'type', 'user_id')
    .then(notes => {
      res.json(notes)
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router
