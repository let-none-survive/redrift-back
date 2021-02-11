const queries = require('../../db/queries')

module.exports = async ctx => {
  const productions_raw = await queries.productions.getProductions()
  const productions = []
  for (const pr of productions_raw) {
    const production = {
      ...pr
    }
    const distributedAmount = await queries.warehouse.getDistributedAmount(production.id)
    production.unDistributedAmount = production.amount - distributedAmount
    production.distributedAmount = distributedAmount

    productions.push(production)
  }
  ctx.body = productions
}
