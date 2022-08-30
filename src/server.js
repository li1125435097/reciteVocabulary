const { join } = require('path')
const koa = require('koa')
const router = require('koa-router')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')


// 定义全局变量
const app = new koa()
const ROOT_PATH = process.cwd()
const PORT = process.env.PORT || 3000

app.keys = ['梅比乌斯','梦比优斯','艾斯','泰罗','赛罗']
app.use(session({key:'k2.sess',maxAge: 86400000}, app))
global.Router = router
global.Join = join
global.l = console.log
global.el = console.error
global.VIEWS = join(ROOT_PATH,'views')
global.PUBLIC = join(ROOT_PATH,'public')
const DBPATH = require('./orm')
const version = require('../package.json').version
if(process.env.CREATETABLE) DBPATH.createTable()


// 路由挂载
app.use(require('koa-static')(PUBLIC,{maxage:1000*86400*1e5}))
app.use(require('./middleware/filter'))
app.use(bodyParser({limit:1024*5}))
app.use(require('./controller/user'))
app.use(require('./controller/pages'))
app.use(require('./controller/libs'))
app.use(require('./controller/plan'))
app.use(require('./controller/start'))
app.use(require('./controller/subset'))
app.use(require('./controller/sqlite'))


// 错误处理
app.use((ctx)=>ctx.body='<h1>欢迎访问单词背诵网站</h1><h1>有问题联系<3162853966@qq.com></h1>')
app.on('error', (err, ctx)=>{el('服务器出错: ', err, ctx)})

// 服务器启动
// app.removeAllListeners
app.listen(PORT,function(){
  let sign = '*'.repeat(30)
  l(sign) 
  l('服务启动成功')
  l(`PORT: ${PORT}  \nENV: ${process.env.ENV} \nDBPATH: ${DBPATH.dataPath} \nVERSION: ${version}`) 
  l(sign)
})



