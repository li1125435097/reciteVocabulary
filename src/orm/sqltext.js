// CREATE TABLE IF NOT EXISTS sqltxt (
//   id INTEGER primary key AUTOINCREMENT, 
//   name VARCHAR(30), 
//   txt VARCHAR(500))

const tableName = 'sqltxt'   // 单词表的子表，用来存放以用户为纬度的生词，简单词的单词id
const profix = 'orm/sqltxt/'

async function create(data){
  const {name,text} = data
  let sql = `insert into ${tableName}(name,txt) values('${name}','${text}')`     // type INTEGER,   enum 0:疑难词  1:简单词
  let result = await execSql(sql).catch((err)=>printErrlog(profix,'create',err))
  return result ? {error:0,msg:'添加成功'} : {error:1,msg:'添加失败，请稍后再试'}
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
  // result = await create({name:'查询计划',text:'select * from plan'})
  // result = await del({user:'李金科',id:1})
  // result = await update({user:'李金科',id:2},{type:1})
  result = await find()
  l(result)
}
test()

module.exports = {
  create,
  del,
  update,
  find
}

