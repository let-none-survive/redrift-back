const Validator = require('validatorjs')
const queries = require('../../db/queries')
const _pick = require('lodash/pick')

module.exports = async ctx => {
  const data = ctx.request.body
  // validation
  const validation = new Validator(data, {
    name: 'required|string',
    amount: 'required|min:0',
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

  console.log(`create production with data: ${JSON.stringify(productionData)}`)
  const production = await queries.productions.createProduction(productionData)
  console.log(`created production with data: ${JSON.stringify(production)}`)

  if (Array.isArray(data.applyTo) && data.applyTo.length > 0) {
    for (const i of data.applyTo) {
      // todo check if warehouse_id exists
      const warehousePreparedData = {
        production_id: production.id,
        amount: i.amount,
        warehouse_id: i.warehouse_id,
      }
      await queries.warehouse.addToWarehouse(warehousePreparedData)
    }
  }

  ctx.status = 201
  ctx.body = production
}
