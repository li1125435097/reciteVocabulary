// CREATE TABLE IF NOT EXISTS plan (
// id INTEGER primary key AUTOINCREMENT, 
// userid INTEGER REFERENCES user(id) ON UPDATE CASCADE, 
// name CHAR(30), 
// type INTEGER, 
// libs CHAR(50), 
// num INTEGER, 
// offset INTEGER,
// status INTEGER,
// note CHAR(50)

const tableName = 'plan'
const profix = 'orm/plan/'

async function create(data){
  let {userid,name,type,libs,num,note} = data
  let sql = `insert into ${tableName}(userid,name,type,libs,num,offset,status,note) values(${userid},'${name}',${type},'${libs}',${num},0,1,'${note||''}')`
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
  // result = await create({userid:1,name:'计划1',type:0,libs:'核心词汇,红花词',num:50})
  // result = await del({user:'李金科'})
  // result = await update({user:'李金科'},{note:'test'})
  result = await find({user:'李金科'})
  l(result)
}
// test()

module.exports = {
  create,
  del,
  update,
  find
}


