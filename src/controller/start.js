const router = new Router({prefix:'/start'})
const Vocabulary = require('../orm/vocabulary')
const Subset = require('../orm/subset')         // subset.type INTEGER,   enum 0:疑难词  1:简单词
const Plan = require('../orm/plan')
const Aggregate = require('../orm/aggregate')

// 根据计划返回单词
router.get('/', async function (ctx) {
    const {userid} = ctx.session
    let datas = []
    let interference = undefined
    
    // 获取正在执行的计划
    let planing = await Plan.find({userid,status:0})
    if(planing.length<1) return ctx.body = {status:1,msg:'没有正在执行的计划，请先创建计划并执行计划'}
    planing = planing[0]

    let {libs,num,offset,type} = planing
    libs = libs.split(',')
    ctx.session.planing = planing
   
    
    
    // 疑难词词库处理
    let hardIndex = libs.indexOf('疑难词')
    if(hardIndex !== -1){
        let ids = await Subset.find({user:ctx.session.user,type:0},'vid')
        ids = ids.map(v=>v.vid)
        if(ids.length>offset){
            let words = await Vocabulary.find({id:ids.slice(offset),status:1},'id,en,phonetic,zh')
            if(words) datas = datas.concat(words)
            offset = 0
        }else offset-=ids.length
        libs.splice(hardIndex,1) 
    }

    // 获取普通词库
    if(libs.length>0){
        let words = await Vocabulary.find({classify:libs,status:1},'id,en,phonetic,zh',`limit ${offset},${num}`)
        datas = datas.concat(words)
    }

    // 复习时返回300个干扰中文
    if(type === 1){
        let words = await Vocabulary.find({status:1},'zh')
        let randIndex = Math.round(Math.random()*(words.length-300))
        interference = words.slice(randIndex,randIndex+300).map(v=>v.zh)
    }
    
    ctx.body = {status:0,datas,interference}
})


// 智能复习返回单词
router.get('/ai', async function (ctx) {
    const {userid} = ctx.session

    // 错误率加权个数,倒序排列
    let ids = await Aggregate.find({userid},'vid,count() as num,sum(fail)*100/sum(count)*count() as total','group by vid order by total desc limit 30')
    ids = ids.map(v=>v.vid)
    
    // 获取普通词库
    let datas = await Vocabulary.find({id:ids},'id,en,phonetic,zh')
    

    // 复习时返回300个干扰中文
    let words = await Vocabulary.find({status:1},'zh')
    let randIndex = Math.round(Math.random()*(words.length-300))
    let interference = words.slice(randIndex,randIndex+300).map(v=>v.zh)
    
    ctx.body = {status:0,datas,interference}
})

// 当天复习返回单词
router.get('/day', async function (ctx) {
    const {userid} = ctx.session

    // 错误率加权个数,倒序排列
    let ids = await Aggregate.find({userid,time:getDate()},'vid,date(ts,"unixepoch","localtime") as time,count() as num,sum(fail)*100/sum(count)*count() as total','group by vid order by total desc limit 30')
    ids = ids.map(v=>v.vid)
    
    // 获取普通词库
    let datas = await Vocabulary.find({id:ids},'id,en,phonetic,zh')

    // 复习时返回300个干扰中文
    let words = await Vocabulary.find({status:1},'zh')
    let randIndex = Math.round(Math.random()*(words.length-300))
    let interference = words.slice(randIndex,randIndex+300).map(v=>v.zh)
    
    ctx.body = {status:0,datas,interference}
})


// 用户完成当日的一个计划
router.post('/study', async function (ctx) {
    let {ids} = ctx.request.body
    ids = JSON.parse(ids)
    const {planing:{name,offset},userid} = ctx.session
    let result = await Plan.update({userid,name},{offset:offset+ids.length})
    for(const id of ids) await Aggregate.create({userid,id:id.id,count:1,fail:id.fail})
    if(!result.status) ctx.body={status:0}
    else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
})

// 用户完成当日的一个复习
router.post('/review', async function (ctx) {
    let {ids} = ctx.request.body
    ids = JSON.parse(ids)
    const {userid} = ctx.session
    for(const id of ids) await Aggregate.create({userid,id:id.id,count:1,fail:id.fail})
    ctx.body={status:0}
})


module.exports = router.routes()