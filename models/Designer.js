const mongoose = require('mongoose')
const connection = require('../libs/connection')

const designerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title отсутствует."
  },

  fullTitle: {
    type: String
  },

  description: {
    type: String
  }
})

designerSchema.index(
  { title: 'text', description: 'text' },
  {
    weights: { title: 10, description: 5 },
    default_language: 'english',
    name: 'TextSearchIndex',
  }
)

module.exports = connection.model('Designer', designerSchema)
