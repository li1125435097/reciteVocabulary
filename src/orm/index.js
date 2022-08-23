require('./common')
let sqlite3 = require('sqlite3')
sqlite3 = sqlite3.verbose()
let dataPath = process.env.ENV === 'production' 
  ? '/www/data/sqlite/rvs.db' 
  : 'ref/rvs.db'

// 声明全局变量
global.db = new sqlite3.Database(dataPath)


  

// 数据表sql语句
let tables = {
  user: "CREATE TABLE IF NOT EXISTS user (ts INTEGER, user CHAR(50) primary key, pwd CHAR(50), test CHAR(50), status CHAR(50), note CHAR(50))",
  plan: "CREATE TABLE IF NOT EXISTS plan (user CHAR(50), name CHAR(50), type INTEGER, libs CHAR(50), num INTEGER, note CHAR(50))",
  vocabulary: "CREATE TABLE IF NOT EXISTS vocabulary (id INTEGER primary key,inid INTEGER, en CHAR(50), phonetic CHAR(50), zh CHAR(50), status CHAR(50), classify CHAR(50))",
  daysum:  "CREATE TABLE IF NOT EXISTS daysum (date CHAR(10), user CHAR(50), first CHAR(350), second CHAR(350), third CHAR(350), fourth CHAR(350), fifth CHAR(350))",
  mix:  "CREATE TABLE IF NOT EXISTS mix (user CHAR(50), mark CHAR(20), vals CHAR(50), vali INTEGER, note CHAR(50))"
}

for(let table in tables){
  let sql = tables[table]
  db.run(sql,err => {
    if(err) el(table+'表创建失败：'+err)
    else l(table+'表存在或创建成功')
  })
}

require('./plan')
