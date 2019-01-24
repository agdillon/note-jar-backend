const express = require('express')
const router = express.Router()
const knex = require('../knex')

// GET one note
router.get('/:id', (req, res, next) => {
  knex('notes')
    .leftJoin('note_tags', 'notes.id', 'note_id')
    .innerJoin('tags', 'tags.id', 'tag_id')
    .select(['author', 'content', 'notes.created_at', 'note_id', 'type', 'user_id', knex.raw('ARRAY_AGG(tag_name) as tag_name')])
    .where('note_id', req.params.id)
    .groupBy('author', 'content', 'notes.created_at', 'note_id', 'type', 'user_id')
    .then(note => {
      res.json(note)
    })
    .catch(err => {
      next(err)
    })
})

// POST a new note
router.post('/', (req, res, next) => {
  res.send('POST a note')
})

// PATCH a note
router.patch('/:id', (req, res, next) => {
  res.send('PATCH a note')
})

// DELETE a note
router.delete('/:id', (req, res, next) => {
  res.send('DELETE a note')
})

module.exports = router
