require('dotenv').config()
const Koa = require('koa')
const cors = require('@koa/cors')
const koaBody = require('koa-body')

const app = new Koa()
app.use(cors({
  origin: '*',
}))
// body parser
app.use(koaBody({ multipart: true, includeUnparsed: true }))

// error handling
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = { message: err.message }
    ctx.app.emit('error', err, ctx)
  }
})

app.on('error', (err, ctx) => {
  console.error(err)
  if (process.env.NODE_ENV === 'development') {
    ctx.set('Content-Type', 'text/plain')
    ctx.status = 500
    ctx.body = err.stack
  } else {
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
})

// routes
const Router = require('koa-router')
const apiRouter = new Router({ prefix: '/api/v1' })
apiRouter
  .use(require('./routes/index').routes())
  .use(require('./routes/warehouses').routes())
  .use(require('./routes/productions').routes())
  .use(require('./routes/warehouse').routes())
app.use(apiRouter.routes())

// server
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

module.exports = server
