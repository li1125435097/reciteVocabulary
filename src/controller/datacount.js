const router = new Router({prefix:'/aggregate'})
const Vocabulary = require('../orm/vocabulary')
const Aggregate = require('../orm/aggregate')


// 空路径返回缓存的html文件列表
router.get('/', async function (ctx) {
    // const {lib} = ctx.query
    // let datas = []
    // if(!lib) return ctx.body = {datas}
    // if(['疑难词','简单词'].includes(lib)){
    //     let ids = await Subset.find({user:ctx.session.user,type:['疑难词','简单词'].indexOf(lib)},'id')
    //     ids = ids.map(v=>v.id)
    //     if(ids.length>0) datas = await Vocabulary.find({id:ids},'id,en,zh')
    // }else datas = await Vocabulary.find({classify:lib},'id,en,zh') 

    // ctx.body = {datas}
    ctx.body = 'hellow'
})

// 用户添加单词到单词本
router.get('/add', async function (ctx) {
    const {id,type} = ctx.query
    ctx.body = 'hellow'
    // if(![0,1].includes(+type) || !id) return ctx.body={status:1,msg:'数据不合法'}
    // let result = await Subset.create({user:ctx.session.user,id,type})
    // if(!result.status) ctx.body={status:0}
    // else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})

// 用户从单词本移除单词
router.get('/del', async function (ctx) {
    const {id,lib} = ctx.query
    let type = ['疑难词','简单词'].indexOf(lib)
    if(![0,1].includes(type) || !id) return ctx.body={status:1,msg:'数据不合法'}
    let result = await Subset.del({user:ctx.session.user,id,type})
    if(result) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})


module.exports = router.routes()