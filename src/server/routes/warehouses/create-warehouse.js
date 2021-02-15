const Validator = require('validatorjs')
const queries = require('../../db/queries')
const _pick = require('lodash/pick')

module.exports = async ctx => {
  const data = ctx.request.body
  // validation
  const validation = new Validator(data, {
    name: 'required|string',
    'productions.*.amount': 'min:0',
    'productions.*.production_id': 'integer',
  })

  if (validation.fails()) {
    ctx.status = 422
    return (ctx.body = {
      message: 'The given data was invalid.',
      errors: validation.errors.all(),
    })
  }

  const warehouseData = _pick(data, ['name'])

  console.log(`create warehouse with data: ${JSON.stringify(warehouseData)}`)
  const warehouse = await queries.warehouses.createWarehouse(warehouseData)
  console.log(`created warehouse with data: ${JSON.stringify(warehouse)}`)

  if (Array.isArray(data.productions) && data.productions.length > 0) {
    for (const i of data.productions) {
      // todo check if warehouse_id exists
      const warehousePreparedData = {
        production_id: i.production_id,
        amount: i.amount,
        warehouse_id: warehouse.id,
      }
      await queries.warehouse.addToWarehouse(warehousePreparedData)
    }
  }

  ctx.status = 201
  ctx.body = warehouse
}
