const knex = require('../connection')
const Warehouse = require('./warehouse')

const firstRow = rows => rows[0] || null

const table_name = 'productions'

exports.createProduction = data => knex(table_name).insert(data).returning('*').then(firstRow)
exports.updateProduction = (id, data) => knex(table_name).update(data).where({id}).returning('*').then(firstRow)
exports.getProductions = (q) => knex(table_name).select('*').where('name', 'ilike', `%${q}%`)
exports.deleteProduction = id => knex(table_name).delete('*').where({id})
exports.getProduction = id => knex(table_name).select('*').where({id}).then(firstRow).then(async data => {
  const warehouse_data = await Warehouse.getWhere({production_id: data.id})
  const applyTo = warehouse_data.map(({warehouse_name, amount, warehouse_id}) => ({warehouse_name, amount, warehouse_id}))
  const newData = {...data, applyTo}
  return newData
})
