const router = new Router({prefix:'/sqlite'})
const Sqltext = require('../orm/sqltext')

// 权限过滤中间件
router.use(async (ctx,next)=>{
  let username = ctx.session.user.user
  if(['贾国鹏','李金科'].includes(username)) await next()
  else return ctx.body = {status:1,msg:'你没有管理员权限'}
})

// sql语句运行接口
router.get('/run', async function (ctx) {
    const {sql} = ctx.query
    let result = await operationSql(sql).catch((err)=>{return ctx.body=err})
    let log = result ? `sql语句运行失败: ${result}` : "运行成功"
    ctx.body = {log}
})

// sql语句查询接口
router.get('/query', async function (ctx) {
  const {sql} = ctx.query
  let result = await execSql(sql).catch((err)=>{return ctx.body=err})
  ctx.body = result
})


// sql语句restApi接口
router
  .post('/sqltxt',async (ctx)=>{
    const { name, sql } = ctx.request.body
    let result = await Sqltext.create({name, text:sql})
    ctx.body = result
  })
  .delete('/sqltxt',async (ctx)=>{
    const { id } = ctx.request.body
    let result = await Sqltext.del({id})
    ctx.body = result
  })
  .put('/sqltxt',async (ctx)=>{
    const { name, sql } = ctx.request.body
    let result = await Sqltext.update(0,{name,sql})
    ctx.body = result
  })
  .get('/sqltxt',async (ctx)=>{
    const { name } = ctx.query
    let result = await Sqltext.find({name})
    ctx.body = result
  })

module.exports = router.routes()