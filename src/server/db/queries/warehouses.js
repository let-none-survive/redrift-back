const knex = require('../connection')
const Warehouse = require('./warehouse')
const Productions = require('./productions')

const firstRow = rows => rows[0] || null

const table_name = 'warehouses'

exports.createWarehouse = data => knex(table_name).insert(data).returning('*').then(firstRow)
exports.removeWarehouse = id => knex(table_name).del().where({id})
exports.updateWarehouse = (id, data) => knex(table_name).update(data).where({id}).returning('*').then(firstRow)
exports.getWarehouses = () => knex(table_name).select('*').then(async data => {
  const preparedData = []
  for (const raw_warehouse of data) {
    const warehouseData = await Warehouse.getWhere({warehouse_id: raw_warehouse.id})
    const warehouse = {...raw_warehouse, productions_amount: warehouseData.reduce((acc, val) => acc + val.amount, 0)}
    preparedData.push(warehouse)
  }
  return preparedData
})

exports.getWarehouse = id => knex(table_name).select('*').where({id}).then(firstRow).then(async data => {
  const productions = []
  const warehouse_raw_data = await Warehouse.getWhere({warehouse_id: data.id})
  for (const raw of warehouse_raw_data) {
    const preparedProductions = {
      amount: raw.amount,
      production_name: raw.production_name,
      production_id: raw.production_id,
      unDistributedAmount: null
    }
    productions.push(preparedProductions)
  }
  return {...data, productions}
})

exports.deleteWarehouse = id => knex(table_name).del().where({id})
