const d = require('debug')('recite:server')
global.express = require('express')
const app = express()

app.use(express.static('public'))



app.use('/',require("./src/controller/index"))

app.listen(3000,function(){	d('服务在3000端口启动成功') })