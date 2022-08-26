const router = new Router({prefix:'/plan'})
const Vocabulary = require('../orm/vocabulary')
const Subset = require('../orm/subset')
const Plan = require('../orm/plan')

// 空路径返回缓存的html文件列表
router.get('/', async function (ctx) {
    const {userid} = ctx.session
    let plans = await Plan.find({userid})
    for(const v in plans) {
        let libs = plans[v].libs.split(',')
        let type0 = libs.indexOf('疑难词')
        let num = 0
        if(type0 != -1){
            let result = await Subset.find({userid,type:0},'count() as count')
            num += result[0].count
        }
        let result = await Vocabulary.find({classify:libs},'count() as count')
        num += result[0].count
        plans[v].count = num
    }
    ctx.body = {plans}
})

// 用户添加计划
router.post('/add', async function (ctx) {
    let {name,type,libs,num} = ctx.request.body
    name = name || Date.now().toString(36)
    let result = await Plan.create({userid:ctx.session.userid,name,type,libs,num})
    if(!result.status) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})

// 用户移除计划
router.get('/del', async function (ctx) {
    const {id} = ctx.query
    if(!id) return ctx.body = {status:1,msg:'数据不合法'}

    let result = await Plan.del({userid:ctx.session.userid,id})
    if(result) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})

// 用户执行计划
router.get('/exec', async function (ctx) {
    const {id} = ctx.query
    if(!id) return ctx.body = {status:1,msg:'数据不合法'}
    
    let r1 = await Plan.update({userid:ctx.session.userid},{status:1})
    let r2 = await Plan.update({userid:ctx.session.userid,id},{status:0})
    if(r1 && r2) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})


module.exports = router.routes()