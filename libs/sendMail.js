const juice = require('juice')
const config = require('../config')
const path = require('path')
const pug = require('pug')

const AWS = require('aws-sdk')
const nodemailer = require('nodemailer')
const htmlToText = require('nodemailer-html-to-text').htmlToText
const SMTPTransport = require('nodemailer-smtp-transport')
const StubTransport = require('nodemailer-stub-transport')
const SesTransport = require('nodemailer-ses-transport')

const Letter = require('../models/Letter')

AWS.config.update(config.mailer.aws)

const transportEngine = process.env.NODE_ENV === 'test'
  ? new StubTransport()
  : config.mailer.transport === 'aws'
    ? new SesTransport({
        ses: new AWS.SES(),
        rateLimit: 50
      })
    : new SMTPTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: config.mailer.gmail.user,
          pass: config.mailer.gmail.password,
        }
      })

const transport = nodemailer.createTransport(transportEngine)

transport.use('compile', htmlToText())

/*
* sendMail - функция, отправляющая письмо на указанный адрес
* options - объект, содержащий опции для отправки писем:
* options.template - имя файла, содержащего шаблон письма
* options.locals - объект с переменными, которые будут переданы в шаблон
* options.to - email, на который будет отправлено письмо
* options.subject - тема письма
* пример:
*     await sendMail({
*       template: 'confirmation',
*       locals: {token: 'token'},
*       to: 'user@mail.com',
*       subject: 'Подтвердите почту',
*     });
* */
module.exports = async function sendMail(options) {
  let sender = config.mailer.senders[options.from || 'default']

  const html = pug.renderFile(
    path.join(__dirname, '../templates', options.template) + '.pug',
    { sender, ...options.locals }
  )

  const message = {
    html: juice(html),
    to: {
      address: options.to,
    },
    subject: options.subject,
    from: {
      name: sender.fromName,
      address: sender.fromEmail
    },
  }

  const transportResponse = await transport.sendMail(message)

  const letter = await Letter.create({
    message,
    transportResponse,
    messageId: transportResponse.messageId //.replace(/@email.amazonses.com$/, '')
  })

  return letter
}

module.exports.transportEngine = transportEngine
