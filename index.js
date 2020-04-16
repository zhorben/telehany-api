const config = require('./config')
const app = require('./app')
const socket = require('./socket')

const port = parseInt(config.port, 10) || 3000

const server = app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})

socket(server)