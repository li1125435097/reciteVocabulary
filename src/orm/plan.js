// CREATE TABLE IF NOT EXISTS plan (
//   user CHAR(50), 
//   name CHAR(50), 
//   type INTEGER, 
//   libs CHAR(50), 
//   num INTEGER, 
//   note CHAR(50))

const tableName = 'plan'
const profix = 'orm/plan/'

async function create(data){
  let {user,name,type,libs,num} = data
  let sql = `insert into ${tableName} values('${user}','${name||''}',${type},'${libs}',${num},'')`
  let result = await execSql(sql).catch((err)=>printErrlog(profix,'create',err))
  return result ? {status:0,msg:'计划新增成功'} : {status:1,msg:'计划新增失败，请稍后再试'}
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
  // result = await create({user:'李金科',name:'计划1',type:0,libs:'核心词汇,红花词',num:50})
  // result = await del({user:'李金科'})
  // result = await update({user:'李金科'},{note:'test'})
  result = await find({user:'李金科'})
  l(result)
}
test()

module.exports = {
  create,
  del,
  update,
  find
}


