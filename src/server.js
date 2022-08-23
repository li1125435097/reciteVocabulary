const { join } = require('path')
const koa = require('koa')
const router = require('koa-router')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')


// 定义全局变量
const app = new koa()
const ROOT_PATH = process.cwd()

app.keys = ['梅比乌斯','梦比优斯','艾斯','泰罗','赛罗']
app.use(session({key:'k2.sess',maxAge: 86400000}, app))
global.Router = router
global.Join = join
global.l = console.log
global.el = console.error
global.VIEWS = join(ROOT_PATH,'views')
global.PUBLIC = join(ROOT_PATH,'public')
require('./orm')


// 路由挂载
app.use(require('koa-static')(PUBLIC,{maxage:1000*86400*1e5}))
app.use(require('./middleware/filter'))
app.use(bodyParser())
app.use(require('./controller/user'))
app.use(require('./controller/pages'))
app.use(require('./controller/libs'))
app.use(require('./controller/plan'))


// 错误处理
app.use((ctx)=>ctx.body='<h1>欢迎访问单词背诵网站</h1><h1>有问题联系<3162853966@qq.com></h1>')
app.on('error', (err, ctx)=>{el('服务器出错: ', err, ctx)})

// 服务器启动
app.removeAllListeners
app.listen(3000,function(){	l('服务在3000端口启动成功') })



