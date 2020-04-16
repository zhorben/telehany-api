const path = require('path')
const { v4: uuidv4 } = require('uuid')
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const Session = require('./models/Session')
const handleMongooseValidationError = require('./libs/validationErrors')
const mustBeAuthenticated = require('./libs/mustBeAuthenticated')

const { recommendationsList } = require('./controllers/recommendations')
const { login } = require('./controllers/login')
const { oauth, oauthCallback } = require('./controllers/oauth')
const { me } = require('./controllers/me')
const { productsBySubcategory, productsByQuery, productList, productById } = require('./controllers/products')
const { checkout, getOrdersList } = require('./controllers/orders')
const { categoryList } = require('./controllers/categories')
const { designerList, designerById } = require('./controllers/designers')
const { register, confirm } = require('./controllers/registration')
const { messageList } = require('./controllers/messages')

const app = new Koa()

app.use(require('koa-static')(path.join(__dirname, 'public')))
app.use(require('koa-bodyparser')())
app.use(cors())

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.status) {
      ctx.status = err.status
      ctx.body = { error: err.message }
    } else {
      console.error(err)
      ctx.status = 500
      ctx.body = { error: 'Internal server error' }
    }
  }
})

app.use((ctx, next) => {
  ctx.login = async function(user) {
    const token = uuidv4()
    await Session.create({ token, user, lastVisit: new Date() })

    return token
  }

  return next()
})

const router = new Router({ prefix: '/api' })

router.use(async (ctx, next) => {
  const header = ctx.request.get('Authorization')
  if (!header) return next()

  const token = header.split(' ')[1]
  if (!token) return next()

  const session = await Session.findOne({ token }).populate('user')
  if (!session) {
    ctx.throw(401, 'Неверный аутентификационный токен')
  }
  session.lastVisit = new Date()
  await session.save()

  ctx.user = session.user
  return next()
})

router.post('/login', login)
router.get('/oauth/:provider', oauth)
router.post('/oauth_callback', handleMongooseValidationError, oauthCallback)
router.get('/me', mustBeAuthenticated, me)
router.post('/register', register)
router.post('/confirm', confirm)

router.get('/categories', categoryList)
router.get('/designers', designerList)
router.get('/designers/:id', designerById)
router.get('/products', productsBySubcategory, productsByQuery, productList)
router.get('/products', productsBySubcategory, productList)
router.get('/products/:id', productById)

router.get('/orders', mustBeAuthenticated, getOrdersList)
router.post('/orders', mustBeAuthenticated, handleMongooseValidationError, checkout)
router.get('/recommendations', recommendationsList)

router.get('/messages', mustBeAuthenticated, messageList)

app.use(router.routes())

// this for HTML5 history in browser
// const fs = require('fs')

// const index = fs.readFileSync(path.join(__dirname, 'public/index.html'))
// app.use(async (ctx) => {
//   if (ctx.url.startsWith('/api') || ctx.method !== 'GET') return

//   ctx.set('content-type', 'text/html')
//   ctx.body = index
// })

module.exports = app
