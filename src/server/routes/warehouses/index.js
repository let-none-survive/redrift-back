const Router = require('koa-router')
const router = new Router()

router.post('/warehouses', require('./create-warehouse'))
router.put('/warehouses/:id', require('./update-warehouse'))
router.get('/warehouses', require('./get-warehouses'))
router.get('/warehouses/:id', require('./get-warehouse'))
router.post('/warehouses/:id', require('./delete-warehouse'))
router.post('/warehouses/:id/move', require('./move-warehouse'))

module.exports = router
