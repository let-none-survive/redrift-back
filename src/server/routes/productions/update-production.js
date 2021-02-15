const Validator = require('validatorjs')
const queries = require('../../db/queries')
const _pick = require('lodash/pick')

module.exports = async ctx => {
  const id = ctx.params.id
  const data = ctx.request.body
  // validation
  const validation = new Validator(data, {
    name: 'string',
    amount: 'min:0',
    'applyTo.*.amount': 'min:0',
    'applyTo.*.warehouse_id': 'integer',
  })

  if (validation.fails()) {
    ctx.status = 422
    return (ctx.body = {
      message: 'The given data was invalid.',
      errors: validation.errors.all(),
    })
  }

  const productionData = _pick(data, ['name', 'amount'])

  console.log(`update production with data: ${JSON.stringify(productionData)}`)
  const production = await queries.productions.updateProduction(
    id,
    productionData
  )
  console.log(`updated production with data: ${JSON.stringify(production)}`)

  if (Array.isArray(data.applyTo) && data.applyTo.length > 0) {
    for (const i of data.applyTo) {
      const { amount, warehouse_id } = i
      const [warehouseData] = await queries.warehouse.getWhere({
        production_id: production.id,
        warehouse_id,
      })
      if (!warehouseData) {
        const warehousePreparedData = {
          production_id: production.id,
          amount,
          warehouse_id,
        }
        await queries.warehouse.addToWarehouse(warehousePreparedData)
      } else {
        const warehouseCopy = { ...warehouseData, amount }
        delete warehouseCopy.warehouse_name
        delete warehouseCopy.production_name
        await queries.warehouse.updateWarehouse(warehouseCopy.id, warehouseCopy)
      }
    }
  }

  ctx.body = production
}
