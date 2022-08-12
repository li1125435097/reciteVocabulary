let sqlite3 = require('sqlite3')
sqlite3 = sqlite3.verbose()
let dataPath = process.env.ENV === 'production' 
  ? '/www/data/sqlite/rvs.db' 
  : 'public/rvs.db'

// 声明全局变量
global.db = new sqlite3.Database(dataPath)


// 数据表sql语句
let tables = {
  user: "CREATE TABLE IF NOT EXISTS user (ts INTEGER, user CHAR(50) primary key, pwd CHAR(50), test CHAR(50), status INTEGER, note CHAR(50))"
}

for(let table in tables){
  let sql = tables[table]
  db.run(sql,err => {
    if(err) el(table+'表创建失败：'+err)
    else l(table+'表存在或创建成功')
  })
}