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
    return ctx.body = { message: 'The given data was invalid.', errors: validation.errors.all() }
  }

  if (Array.isArray(data.moveTo) && data.moveTo.length > 0) {
    for (const i of moveTo) {
      const { amount, warehouse_id, production_id } = i
      const [warehouseData] = await queries.warehouse.getWhere({warehouse_id: id, production_id})
      if (amount <= warehouseData.amount) {
        const preparedWarehouseData = {
          production_id,
          amount,
          warehouse_id
        }
        const [warehouseToMove] = await queries.warehouse.getWhere({warehouse_id, production_id})
        if (warehouseToMove) {
          preparedWarehouseData.amount += warehouseToMove.amount
          await queries.warehouse.updateWarehouse(warehouseToMove.id, preparedWarehouseData)
        }
      }
    }
  }


}
