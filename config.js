const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  port: 3001,
  server: {
    siteHost: process.env.SITE_HOST
  },
  mongodb: {
    uri: 'mongodb://localhost/zhorben'
  },
  crypto: {
    iterations: (process.env.NODE_ENV === 'production' ? 12000 : 1),
    length: 128,
    digest: 'sha512',
  },
  providers: {
    github: {
      app_id: process.env.GITHUB_APP_ID || 'github_app_id',
      app_secret: process.env.GITHUB_APP_SECRET || 'github_app_secret',
      callback_uri: 'http://localhost:3000/oauth/github',
      options: {
        scope: ['user:email'],
      },
    },
    facebook: {
      app_id: process.env.FACEBOOK_APP_ID || 'facebook_app_id',
      app_secret: process.env.FACEBOOK_APP_SECRET || 'facebook_app_secret',
      callback_uri: 'http://localhost:3000/oauth/facebook',
      options: {
        scope: ['email'],
      },
    },
    vkontakte: {
      app_id: process.env.VKONTAKTE_APP_ID || 'vkontakte_app_id',
      app_secret: process.env.VKONTAKTE_APP_SECRET || 'vkontakte_app_secret',
      callback_uri: 'http://localhost:3000/oauth/vkontakte',
      options: {
        scope: ['email'],
      },
    },
  },
  mailer: {
    // transport, aws
    transport: process.env.MAIL_TRANSPORT,
    gmail: {
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_ID,
      secretAccessKey: process.env.AWS_SECRET,
      region: "us-west-2"
    },
    senders:  {
      // transactional emails, register/forgot pass etc
      default:  {
        fromEmail: process.env.MAIL_FROM,
        fromName:  process.env.MAIL_FROM_NAME,
        signature: process.env.MAIL_SIGNATURE
      },
      // newsletters example
      informer: {
        fromEmail: process.env.MAIL_INFORMER_FROM,
        fromName:  process.env.MAIL_INFORMER_FROM_NAME,
        signature: process.env.MAIL_INFORMER_SIGNATURE
      }
    }
  }
}
