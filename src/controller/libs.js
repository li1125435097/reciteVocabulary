const router = new Router({prefix:'/libs'})
const Vocabulary = require('../orm/vocabulary')
const Mix = require('../orm/mix')

// 空路径返回缓存的html文件列表
router.get('/', async function (ctx) {
    let libs = await Vocabulary.find(undefined,'classify','group by classify')
    let mylibs = await Mix.find({userid:ctx.session.userid,mark:['libs','libowner']},'vals,id')
    ctx.body = {libs,mylibs}
})

// 用户添加词库
router.get('/add', async function (ctx) {
    let lib = ctx.query.lib.trim()
    if(!lib) return ctx.body = {status:1,msg:'数据不合法'}
    let result = await Mix.create({userid:ctx.session.userid,mark:'libs',vals:lib})
    if(!result.status) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})

// 用户移除词库
router.get('/del', async function (ctx) {
    let id = ctx.query.id
    if(!id) return ctx.body = {status:1,msg:'数据不合法'}
    let result = await Mix.del({userid:ctx.session.userid,id})
    if(result) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})

// 用户导入词库
router.post('/import', async function (ctx) {
    let {data,name} = ctx.request.body
    data = JSON.parse(data)
    if(data.find(v=>Object.keys(v).length!==3) || !name) return ctx.body={status:1,msg:'恭喜你被拦截'}
    let result = await Vocabulary.createMany(data,name)
    Mix.create({userid:ctx.session.userid,mark:'libowner',vals:name})
    if(result) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})


module.exports = router.routes()