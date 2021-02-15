const queries = require('../../db/queries')

module.exports = async ctx => {
  const id = ctx.params.id
  const production = await queries.productions.getProduction(id)

  ctx.body = production
}
