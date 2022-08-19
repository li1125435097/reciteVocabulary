const fs = require('fs')
require('../src/orm/index')
const Vocabulary = require('../src/orm/vocabulary')
global.l = global.el = console.log


async function main(){
  let fpath = process.env.FPATH
  let classify = process.env.CLASSIFY
  if(!fpath || !classify) return l('参数缺失')

  let datas = await Vocabulary.find({classify},'inid,en,phonetic,zh')
  let dataSerialized = datas.map(v=>Object.values(v)).join('\n')
  let result = writeData(fpath,dataSerialized)
  l(result ? '该路径已存在: '+fpath : '-------> 导出成功: '+fpath)
}
main()


function writeData(fpath,str){
  if(fs.existsSync(fpath)) return true
  let data = fs.writeFileSync(fpath,str)
  return data
}
