require('./common')
let sqlite3 = require('sqlite3')
sqlite3 = sqlite3.verbose()
let dataPath = process.env.ENV === 'production' 
  ? '/www/db/sqlite/rvs.db' 
  : 'ref/rvs.db'

// 声明全局变量
global.db = new sqlite3.Database(dataPath)


  

// 数据表sql语句
let tables = {
  user: `CREATE TABLE IF NOT EXISTS user (
    id INTEGER primary key AUTOINCREMENT, 
    ts INTEGER, 
    user CHAR(30) unique, 
    nickname CHAR(30) unique, 
    pwd CHAR(32), 
    status INTEGER
  )`,
  plan: `CREATE TABLE IF NOT EXISTS plan (
    id INTEGER primary key AUTOINCREMENT, 
    userid INTEGER REFERENCES user(id) ON UPDATE CASCADE, 
    name CHAR(30), 
    type INTEGER, 
    libs CHAR(50), 
    num INTEGER, 
    offset INTEGER,
    status INTEGER,
    note CHAR(50)
  )`,
  vocabulary: `CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER primary key AUTOINCREMENT, 
    en CHAR(20), 
    phonetic CHAR(20), 
    zh CHAR(30), 
    status INTEGER, 
    classify CHAR(30)
  )`,
  mix:  `CREATE TABLE IF NOT EXISTS mix (
    id INTEGER primary key AUTOINCREMENT, 
    userid INTEGER REFERENCES user(id) ON UPDATE CASCADE, 
    mark CHAR(20), 
    vals CHAR(50), 
    vali INTEGER, 
    note CHAR(50)
  )`,
  sqltxt: `CREATE TABLE IF NOT EXISTS sqltxt (
    id INTEGER primary key AUTOINCREMENT, 
    name CHAR(30), 
    txt CHAR(500)
  )`,    // 提供sql客户端服务
  aggregate:  `CREATE TABLE IF NOT EXISTS aggregate (
    id INTEGER primary key AUTOINCREMENT, 
    ts INTEGER, 
    userid INTEGER REFERENCES user(id) ON UPDATE CASCADE, 
    vid INTEGER REFERENCES vocabulary(id) ON UPDATE CASCADE, 
    count INTEGER, 
    fail INTEGER, 
    note CHAR(50)
  )`,
  subset:  `CREATE TABLE IF NOT EXISTS subset (
    id INTEGER primary key AUTOINCREMENT, 
    userid INTEGER REFERENCES user(id) ON UPDATE CASCADE, 
    vid INTEGER REFERENCES vocabulary(id) ON UPDATE CASCADE, 
    type INTEGER, 
    note CHAR(50)
  )`
}



async function createTable(){
  for(let table in tables){
    let sql = tables[table]
    let result = await operationSql(sql).catch(err=>el(table+'表创建失败：'+err))
    if(result) l(table+'表存在或创建成功')
  }
  
  execSql('PRAGMA foreign_keys = ON')   // 启动外键
  execSql('CREATE UNIQUE INDEX unionIndex on aggregate (ts,userid,vid);')   // 创建统计表联合索引，用于添加更新操作
}


module.exports = {dataPath,createTable}