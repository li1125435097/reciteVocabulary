const fs = require('fs')
require('../src/orm/index')
const Vocabulary = require('../src/orm/vocabulary')
global.l = global.el = console.log


async function main(){
  let fpath = process.env.FPATH
  let classify = process.env.CLASSIFY
  if(!fpath || !classify) return l('参数缺失')

  let datas = getData(fpath)
  let result = await Vocabulary.createMany(datas,classify)
  l(result || fpath+'该路径不存在')
}
main()


function getData(fpath){
  if(fs.existsSync(fpath)){}
  else return false
  let data = fs.readFileSync(fpath).toString()
  data = data.split('\n').map(v=>{
    v=v.split(",")
    return {en:v[1],phonetic:v[2],zh:v[3]}
  })
  return data
}
