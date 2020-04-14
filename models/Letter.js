const mongoose = require('mongoose')
const connection = require('../libs/connection')

const letterSchema = new mongoose.Schema({
  message: {},

  messageId: String, // from transport

  // lastSqsNotification: {  },

  transportResponse: {
    messageId: String,
    envelope: {},
    accepted: {},
    rejected: {},
    pending: {},
    response: String
  }

}, {
  timestamps: true
})

letterSchema.index({ 'message.to.address': 1 }) // Message.find({'message.to.address': 'mail@mail.com'})
letterSchema.index({ 'messageId': 1 })

module.exports = connection.model('Letter', letterSchema)