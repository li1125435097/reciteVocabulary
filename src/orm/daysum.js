// CREATE TABLE IF NOT EXISTS daysum (
//   date CHAR(10), 
//   user CHAR(50),
//   first CHAR(350), 
//   second CHAR(350), 
//   third CHAR(350), 
//   fourth CHAR(350), 
//   fifth CHAR(350))
const tableName = 'daysum'
const profix = 'orm/daysum/'

async function create(data){
  const {user,body} = data
  let date = getDate()
  let blank = await getBlank(user,date)
  if(blank === false) return {error:1,msg:'本日提交次数已达上限，请明日再试'}
  
  if(blank === true){
    let sql = `insert into ${tableName} values('${getDate()}','${user}','${body}','','','','')`
    let result = await execSql(sql).catch((err)=>printErrlog(profix,'create',err))
    return result ? {error:0,msg:'添加成功'} : {error:1,msg:'添加失败，请稍后再试'}
  }
  else return update({user,date},{[blank]:body})
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

async function getBlank(user,date){
  let data = await find({user,date})
  if(data.length>0){
    data = data[0]
    for(const k in data){
      if(data[k]) continue
      return k
    }
    return false
  }
  else return true
}

async function test(){
  let result
  // result = await create({user:'李金',body:'2524-6,15-4,13-375'})
  // result = await del({user:'李金',date:'2022-08-18'})
  // result = await update({user:'李金科',date:'2022-08-18'},{first:'abcde'})
  result = await find()
  l(result)
}
// test()

module.exports = {
  create,
  del,
  update,
  find
}

