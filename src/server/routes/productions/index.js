const Router = require('koa-router')
const router = new Router()

router.post('/productions', require('./create-production'))
router.put('/productions/:id', require('./update-production'))
router.get('/productions', require('./get-productions'))

module.exports = router
