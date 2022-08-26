// CREATE TABLE IF NOT EXISTS subset (
//   id INTEGER primary key AUTOINCREMENT, 
//   userid INTEGER REFERENCES user(id) ON UPDATE CASCADE, 
//   vid INTEGER REFERENCES vocabulary(id) ON UPDATE CASCADE, 
//   type INTEGER, 
//   note CHAR(50)
// )
const tableName = 'subset'   // 单词表的子表，用来存放以用户为纬度的生词，简单词的单词id
const profix = 'orm/subset/'

async function create(data){
  const {userid,id,type,note} = data
  let sql = `insert into ${tableName}(userid,vid,type,note) values(${userid},${id},${type},'${note||""}')`     // type INTEGER,   enum 0:疑难词  1:简单词
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
  // result = await create({user:'李金科',id:2,type:0})
  // result = await del({user:'李金科',id:1})
  // result = await update({user:'李金科',id:2},{type:1})
  result = await find({user:'李金科',type:1},'id')
  l(result)
}
// test()

module.exports = {
  create,
  del,
  update,
  find
}

