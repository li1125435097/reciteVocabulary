const crypto = require('crypto')

// 获取年月日时间
global.getDate = function(){
  let date = new Date()
  let year = date.getFullYear()
  let month = String(date.getMonth()+1).padStart(2,0)
  let day = String(new Date().getDate()).padStart(2,0)
  return year +'-'+ month +'-'+ day
}

// 获取十位时间戳
global.getTimestamp = function(){
  return Math.round(Date.now()/1e3)
}

// 获取年月日时间戳
global.getdayTimestamp = function(){
  let date = new Date().toLocaleString().split(' ')[0]
  let ts = new Date(date).getTime()/1e3
  return ts
}

// sqlite操作命令异步封装
global.operationSql = (sql) =>{
  return new Promise((resolve, reject) =>
    db.run(sql, (err) =>{
      if(err) reject(err) 
      else resolve(true)
    })
  )
}

// sqlite运行sql异步封装
global.execSql =  (sql) =>{
  return new Promise( (resolve, reject) =>
    db.all(sql,(err,rows) => {
      if(err) reject(err)
      else resolve(rows)
    })
  )    
}

/**
 * 通用查询函数
 * @param {string} tableName  
 * @param {string} profix  
 * @param {Object} criteria  
 * @param {string} column  
 * @param {string} ext 
 * @returns Array
 */
global.confind = async (tableName,profix,criteria,column,ext) => {
  let condition = parseObjToWhere(criteria,' and ')
  let sql = `select ${column || '*'} from ${tableName} ${condition || ''} ${ext||''}`
  let result = await execSql(sql).catch((err)=>printErrlog(profix,'find',err))
  return result || []
}

/**
 * 通用删除函数
 * @param {string} tableName  
 * @param {string} profix  
 * @param {Object} criteria  
 * @returns boolean
 */
 global.condel = async (tableName,profix,criteria) => {
  let condition = parseObjToWhere(criteria,' and ')  
  let sql = `delete from ${tableName} ${condition}`
  let result = await operationSql(sql).catch((err)=>printErrlog(profix,'del',err))
  return result
}

/**
 * 通用更新函数
 * @param {string} tableName  
 * @param {Object} criteria  
 * @param {string} profix  
 * @returns boolean
 */
 global.conupdate = async (tableName,profix,criteria,date) => {
  let condition = parseObjToWhere(criteria,' and ')  
  let upVla = parseObjToWhere(date,',','set')
  let sql = `update ${tableName} ${upVla} ${condition}`
  let result = await operationSql(sql).catch((err)=>printErrlog(profix,'update',err))
  return result
}

// 对象解析成where语句
function parseObjToWhere(criteria,conjunction,param='where'){
  let condition,dataLs = Object.entries(criteria || {})
  if(dataLs.length>0){
    condition = []
    dataLs.map(v=>{
      [key,value] = v
      if(typeof value === 'string') condition.push(`${key}='${value}'`)
      else if(typeof value === 'number') condition.push(`${key}=${value}`)
      else if(Array.isArray(value)) condition.push(`${key} in('${value.join("','")}')`)
    })
    condition = condition.length > 0 ? param+' ' + condition.join(conjunction) : ''
    return condition
  }
}

// 错误日志输出封装
global.printErrlog = (profix,text,err) =>{
  text = profix+text
  let id = getTimestamp().toString(36)
  let sign = '?'.repeat(100)
  let pointa = sign.length/2-Math.ceil(text.length/2)-2
  let pointb = sign.length/2+Math.floor(text.length/2)+2
  let head = id+': '+sign.slice(0,pointa)+'  '+text+'  '+sign.slice(pointb)+'\n'
  let foot = '\n'+id+': '+sign
  el(head)
  el(err)
  el(foot)
}

// 解析note字符串成对象
global.parseNote = function(note){
  if(!note) return {}
  let result = Object.fromEntries(note.split(',').map(v=>v.split(':')))
  return result
}

// 对象序列化成note字符串成
global.toNote = function(obj){
  if(Object.keys(obj).length<1) return ''
  let result = Object.entries({offset: '1', mybe: '2'}).map(v=>v.join(':')).join(',')
  return result
}

// md5复合加密封装
global.md5 = (data) => {
  let sha512 = crypto.createHash('sha512').update(data).digest('hex')
  let md5 = crypto.createHash('md5').update(sha512).digest('hex')
  return md5
}