const router = new Router({prefix:'/plan'})
const Plan = require('../orm/plan')
const Mix = require('../orm/mix')

// 空路径返回缓存的html文件列表
router.get('/', async function (ctx) {
    const {user} = ctx.session
    let plans = await Plan.find({user},'libs,name,type,num')
    let planing = await Mix.find({user,mark:'plan'},'vals')
    ctx.body = {plans,planing}
})

// 用户添加计划
router.post('/add', async function (ctx) {
    const {name,type,libs,num} = ctx.request.body

    let result = await Plan.create({user:ctx.session.user,name,type,libs,num})
    if(!result.status) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})

// 用户移除计划
router.get('/del', async function (ctx) {
    let name = ctx.query.name.trim()
    if(!name) return ctx.body = {status:1,msg:'数据不合法'}
    let result = await Plan.del({user:ctx.session.user,name})
    if(result) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})

// 用户执行计划
router.get('/exec', async function (ctx) {
    let name = ctx.query.name.trim()
    if(!name) return ctx.body = {status:1,msg:'数据不合法'}
    
    let result
    let isExist = await Mix.find({user:ctx.session.user,mark:'plan'})
    if(isExist.length<1) result = await Mix.create({user:ctx.session.user,mark:'plan',vals:name})
    else result = await Mix.update({user:ctx.session.user,mark:'plan'},{vals:name})
    if(result) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})


module.exports = router.routes()