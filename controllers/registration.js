const { v4: uuidv4 } = require('uuid')
const User = require('../models/User')
const sendMail = require('../libs/sendMail')
const config = require('../config')

module.exports.register = async (ctx, next) => {
  const verificationToken = uuidv4()

  const user = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken,
  })

  await user.setPassword(ctx.request.body.password)
  await user.save()

  await sendMail({
    to: user.email,
    subject: 'Подтвердите почту',
    locals: {
      link: config.server.siteHost + '/confirm/' + verificationToken
    },
    template: 'confirmation',
  })

  ctx.body = { status: 'ok' }
}

module.exports.confirm = async (ctx, next) => {
  const user = await User.findOne({
    verificationToken: ctx.request.body.verificationToken,
  })

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела')
  }

  user.verificationToken = undefined
  await user.save()

  const token = uuidv4()

  ctx.body = { token }
}
