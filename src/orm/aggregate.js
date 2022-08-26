// CREATE TABLE IF NOT EXISTS aggregate (
//   id INTEGER primary key AUTOINCREMENT, 
//   ts INTEGER, 
//   userid INTEGER REFERENCES user(id) ON UPDATE CASCADE, 
//   vid INTEGER REFERENCES vocabulary(id) ON UPDATE CASCADE, 
//   count INTEGER, 
//   fail INTEGER, 
//   note CHAR(50)
// )

const tableName = 'aggregate'   // 单词表的子表，用来存放以用户为纬度的生词，简单词的单词id
const profix = 'orm/aggregate/'

async function create(data){
  const {userid,id,count,fail,note} = data
  let ts = getdayTimestamp()
  let sql = `
    insert into ${tableName}(ts,userid,vid,count,fail,note) 
    values(${ts},${userid},${id},${count},${fail},'${note||""}')
    ON CONFLICT do UPDATE set count=count+${count},fail=fail+${fail}
    `
  let result = await execSql(sql).catch((err)=>printErrlog(profix,'addUpdate',err))
  return result ? {error:0,msg:'添加更新成功'} : {error:1,msg:'添加更新失败，请稍后再试'}
}

function del(condition){
  return condel(tableName,profix,condition)
}

// update(condition,data)
function update(...param){
  return conupdate(tableName,profix,...param)
}

// find(condition,column,ext)
function find(...param){
  return confind(tableName,profix,...param)
}

async function test(){
  let result
  result = await create({userid:5,id:2,count:10,fail:10})
  // result = await del({id:1})
  // result = await update({id:1},{count:11})
  // result = await find()
  l(result)
}
// test()

module.exports = {
  create,
  del,
  update,
  find
}

