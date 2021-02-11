const Router = require('koa-router')
const router = new Router()

router.post('/warehouses', require('./create-warehouse'))
router.put('/warehouses/:id', require('./update-warehouse'))
router.delete('/warehouses/:id', require('./delete-warehouse'))

module.exports = router
