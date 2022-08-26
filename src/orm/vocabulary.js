// CREATE TABLE IF NOT EXISTS vocabulary (
//   id INTEGER primary key AUTOINCREMENT, 
//   en CHAR(20), 
//   phonetic CHAR(20), 
//   zh CHAR(30), 
//   status INTEGER, 
//   classify CHAR(30)
// )

const tableName = 'vocabulary'
const profix = 'orm/vocabulary/'

async function create(data){
  let {en, phonetic, zh, classify} = data
  let sql = `insert into ${tableName}(en,phonetic,zh,status,classify) values('${en}','${phonetic}','${zh}',1,'${classify}')`
  let result = await execSql(sql).catch((err)=>printErrlog(profix,'create',err))
  return result ? {error:0,msg:'添加成功'} : {error:1,msg:'添加失败，请稍后再试'}
}

async function createMany(datas,classify){
  let isExist = await find({classify},0,'limit 1')
  if(isExist.length>0) return {error:1,msg:'该词库已存在，不可重复插入数据'}

  let sql = `insert into ${tableName}(en,phonetic,zh,status,classify) values `
  datas.map(v=>{
    sql += `('${v.en}',"${v.phonetic}",'${v.zh}',1,'${classify}'),`
  })
  sql = sql.slice(0,-1)

  let result = await execSql(sql).catch((err)=>printErrlog(profix,'createMany',err))
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
  // result = await create({en:'you',zh:'你',phonetic:'[you]',classify:'测试'})
  // result = await createMany([{en:'me',zh:'我',phonetic:'[me]'},{en:'he',zh:'他',phonetic:'[he]'}],'测试1')
  // result = await del({id:1})
  // result = await update({id:1},{classify:'测试',en:'i',zh:'我'})
  // result = await find({en:'i'})
  result = await find()
  l(result)
}
// test()

module.exports = {
  create,
  createMany,
  del,
  update,
  find
}