const queries = require('../../db/queries')

module.exports = async ctx => {
  ctx.body = await queries.warehouses.getWarehouses()
}
