const Router = require('koa-router')
const router = new Router()

router.get('/warehouse', require('./get-warehouse'))

module.exports = router
