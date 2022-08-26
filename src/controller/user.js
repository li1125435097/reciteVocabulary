const User = require('../orm/user')
const router = new Router({prefix:'/user'})

// 登录
router.post('/login', async function (ctx) {
    const {user,pwd} = ctx.request.body
    if(!user || !pwd) return ctx.body = {status:1,msg:'账号密码为空'}
    const userid = await User.findCheckPwd(user,pwd)
    if(userid){
        ctx.session.user = user
        ctx.session.userid = userid
        ctx.body = {status:0}
    }else ctx.body = {status:1,msg:'账号密码错误'}
})

// 退出登录
router.get('/logout', async function (ctx) {
    ctx.session = null
    ctx.body = {status:0,msg:'退出成功'}
})

// 注册
router.post('/register', async function (ctx) {
    const {user,pwd} = ctx.request.body
    if(!user || !pwd) return ctx.body = {status:1,msg:'账号密码为空'}
    const result = await User.create({user,pwd})
    if(!result.status){
        ctx.session.user = user
        ctx.session.userid = result.userid
    }   
    ctx.body = result
})


module.exports = router.routes()