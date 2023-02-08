const l = console.log
function r(p){l(Reflect.ownKeys(p))}

function main(app){
  
  let mls = app.middleware

  mls.map(v=>{
    let name = v.name
    if(name === 'dispatch') routerParse(v.router)
    else l('中间件',name)
  })
}

// 路由解析 返回 results
function routerParse(router){

  let Caches = [{url:'请求路径',method:'请求方法',params:'请求参数',body:'代码'}]
  layerParse(router,Caches)

  // l(Caches)
  return Caches
  
}

function layerParse(layer,caches,flag){
  const {opts:{end},methods,stack,path,regexp} = layer
  l(flag)
  if(!end){
    stack.map(v=>{
      if(v.otps) layerParse(v,caches,'inner')
    })
  }else{
    caches.push({url:path,method:methods.join(','),params:'',code:stack,pattern:regexp})
  }
  // l(caches)
}


module.exports = main