const debug = require('debug')('recite:server')
const { join } = require('path')
const koa = require('koa')
const router = require('koa-router')


// 定义全局变量
const app = new koa()
const ROOT_PATH = process.cwd()
global.Router = router
global.Join = join
global.l = console.log
global.M = join(ROOT_PATH,'src/module')
global.V = join(ROOT_PATH,'views')
global.C = join(ROOT_PATH,'src/controller')
global.O = join(ROOT_PATH,'src/orm')
global.P = join(ROOT_PATH,'public')


// 路由挂载
const load = function(module){ return require(join(C,module)) }
app.use(require('koa-static')(P,{maxage:1000*86400*1e5}));
app.use(load('pages'))


// 服务器启动
app.listen(3000,function(){	debug('服务在3000端口启动成功') })



