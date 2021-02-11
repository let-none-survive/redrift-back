const queries = require('../../db/queries')

module.exports = async ctx => {
  const id = ctx.params.id
  ctx.body = await queries.warehouses.getWarehouse(id)
}