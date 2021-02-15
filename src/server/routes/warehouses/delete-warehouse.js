const Validator = require('validatorjs')
const queries = require('../../db/queries')

module.exports = async ctx => {
  const id = ctx.params.id

  const data = ctx.request.body
  // validation
  const validation = new Validator(data, {
    'moveTo.*.warehouse_id': 'min:0',
    'moveTo.*.production_id': 'min:0',
    'moveTo.*.amount': 'min:0',
  })

  if (validation.fails()) {
    ctx.status = 422
    return (ctx.body = {
      message: 'The given data was invalid.',
      errors: validation.errors.all(),
    })
  }

  if (Array.isArray(data.moveTo) && data.moveTo.length > 0) {
    for (const i of data.moveTo) {
      const { amount, warehouse_id, production_id } = i
      // check if target warehouse has already inside this production
      const [targetWarehouse] = await queries.warehouse.getWhere({
        warehouse_id,
        production_id,
      })
      if (!targetWarehouse) {
        await queries.warehouse.addToWarehouse({
          amount,
          warehouse_id,
          production_id,
        })
      } else {
        delete targetWarehouse.warehouse_name
        delete targetWarehouse.production_name
        await queries.warehouse.updateWarehouse(targetWarehouse.id, {
          ...targetWarehouse,
          amount: targetWarehouse.amount + amount,
        })
      }
    }
  }
  await queries.warehouses.deleteWarehouse(id)

  ctx.body = {}
}
