const Router = require('koa-router');
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'Api works'
  };
})

module.exports = router;
