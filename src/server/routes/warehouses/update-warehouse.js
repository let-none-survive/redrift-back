const Validator = require('validatorjs')
const queries = require('../../db/queries')
const _pick = require('lodash/pick')

module.exports = async ctx => {
  const id =  ctx.params.id
  const data = ctx.request.body
  // validation
  const validation = new Validator(data, {
    name: 'string',
    'productions.*.amount': 'min:0',
    'productions.*.production_id': 'integer'
  })

  if (validation.fails()) {
    ctx.status = 422
    return ctx.body = { message: 'The given data was invalid.', errors: validation.errors.all() }
  }

  const productionData = _pick(data, [
    'name',
    'amount'
  ])

  console.log(`update warehouse with data: ${JSON.stringify(productionData)}`)
  const warehouse = await queries.warehouses.updateWarehouse(id, productionData)
  console.log(`updated warehouse with data: ${JSON.stringify(warehouse)}`)

  if (Array.isArray(data.productions) && data.productions.length > 0) {
    for (const i of data.productions) {
      const { amount, production_id } = i
      const [warehouseData] = await queries.warehouse.getWhere({warehouse_id: warehouse.id, production_id})
      if (!warehouseData) {
        const warehousePreparedData = {
          production_id,
          amount,
          warehouse_id: warehouse.id
        }
        await queries.warehouse.addToWarehouse(warehousePreparedData)
      } else {
        const warehouseCopy = {...warehouseData, amount}
        await queries.warehouse.updateWarehouse(warehouseCopy.id, warehouseCopy)
      }
    }
  }

  ctx.body = warehouse
}
