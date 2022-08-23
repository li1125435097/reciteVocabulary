// CREATE TABLE IF NOT EXISTS mix (
//   user CHAR(50), 
//   mark CHAR(20), 
//   vals CHAR(50), 
//   vali INTEGER, 
//   note CHAR(50))
const tableName = 'mix'
const profix = 'orm/mix/'

async function create(data){
  const {user,mark,vals,vali,note} = data
  let sql = `insert into ${tableName} values('${user}','${mark}','${vals||""}',${vali||null},'${note||""}')`
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
  // result = await create({user:'李金科',mark:'libs',vals:'核心词汇'})
  // result = await del({user:'李金科',vals:'核心词汇'})
  // result = await update({user:'李金科',mark:'libs',vals:'核心词汇'},{vals:'红花词'})
  result = await find({user:'李金科',mark:'libs'})
  l(result)
}
// test()

module.exports = {
  create,
  del,
  update,
  find
}

