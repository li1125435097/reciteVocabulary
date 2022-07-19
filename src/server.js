const debug = require('debug')('recite:server')
import { join } from 'path'
const koa = require('koa')
const router = require('koa-router')


// 定义全局变量
const app = new koa()
const ROOT_PATH = process.cwd()
global.Router = router
global.Join = join
global.l = console.log
global.VIEWS = join(ROOT_PATH,'views')
global.PUBLIC = join(ROOT_PATH,'public')


// 路由挂载
app.use(require('koa-static')(PUBLIC,{maxage:1000*86400*1e5}));
app.use(require('./controller/pages'))


// 服务器启动
app.listen(3000,function(){	debug('服务在3000端口启动成功') })



