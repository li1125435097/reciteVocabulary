const User = require('../orm/user')
const router = new Router({prefix:'/user'})

// 登录
router.post('/login', async function (ctx) {
    const {user,pwd} = ctx.request.body
    if(!user || !pwd) return ctx.body = {status:1,msg:'账号密码为空'}
    const userobj = await User.findCheckPwd(user,pwd)
    if(userobj){
        ctx.session.user = userobj
        ctx.session.userid = userobj.id
        ctx.body = {status:0}
    }else ctx.body = {status:1,msg:'账号密码错误'}
})

// 退出登录
router.get('/logout', async function (ctx) {
    ctx.session = null
    ctx.body = {status:0,msg:'退出成功'}
})

// 获取用户session
router.get('/session', async function (ctx) {
    ctx.body = {status:0,msg:ctx.session}
})

// 注册
router.post('/register', async function (ctx) {
    const {user,pwd} = ctx.request.body
    if(!user || !pwd) return ctx.body = {status:1,msg:'账号密码为空'}
    const result = await User.create({user,pwd})
    if(!result.status){
        ctx.session.user = result
        ctx.session.userid = result.id
    }   
    ctx.body = result
})

// 用户设置
router
    .put('/user', async function (ctx) {
        const {nickname} = ctx.request.body
        let result = await User.update({id:ctx.session.userid},{nickname})
        if(!result.status){
            ctx.body={status:0}
            ctx.session.user.nickname = nickname
        }
        else ctx.body={status:1,msg:'操作失败，请刷新后再试'}
    })
    .get('/user', async function (ctx) {
        const {nickname} = ctx.session.user
        ctx.body = {status:0,data:{nickname}}
    })




module.exports = router.routes()