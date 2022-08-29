// CREATE TABLE IF NOT EXISTS user (
  // id INTEGER primary key AUTOINCREMENT, 
  // ts INTEGER, 
  // user CHAR(30) unique, 
  // pwd CHAR(32), 
  // status INTEGER

const tableName = 'user'
const profix = 'orm/user/'

async function create(data){
  let {user,pwd} = data
  let isExist = await userExist(user)
  if(isExist) return {status:1,msg:'该用户名已被注册'}
  
  pwd = md5(pwd)
  let sql = `insert into ${tableName}(ts,user,pwd,status) values(${getTimestamp()},'${user}','${pwd}',1)`
  let result = await execSql(sql).catch((err)=>printErrlog(profix,'create',err))
  let userid = await find({user})
  return result ? {status:0,userid:userid[0].id,msg:'注册成功'} : {status:1,msg:'注册失败，请稍后再试'}
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

async function findCheckPwd(user,pwd){
  let [data] = await find({user:user})
  if(!data) return false
  if(md5(pwd) === data.pwd && data.status === 1) return data
  return false
}

async function userExist(user){
  let result = await find({user:user})
  return result && result.length>0
}


async function test(){
  let result
  // result = await create({user:'李金科',pwd:'1'})
  // result = await del({user:'李金科'})
  // result = await update({user:'李金科'},{note:'test'})
  result = await find({user:'李金科'})
  // result = await findCheckPwd('李金科','1')
  // result = await userExist('李金科')
  l(result)
}
// test()

module.exports = {
  create,
  del,
  update,
  find,
  findCheckPwd,
  userExist
}


