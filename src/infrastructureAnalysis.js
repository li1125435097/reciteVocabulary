const l = console.log
function r(p){l(Reflect.ownKeys(p))}

function main(app){
  
  let mls = app.middleware
  let rs = []

  mls.map(v=>{
    let name = v.name
    if(name === 'dispatch') rs.push(routerParse(v.router))
    else l('中间件',name)
  })

  l(rs.flat())
}

// 路由解析 返回 [{url:'请求路径',method:'请求方法',params:'请求参数',body:'代码'}]
function routerParse(router){

  // {url:'请求路径',method:'请求方法',params:'请求参数',body:'代码'}
  let Caches = []
  layerParse(router,Caches)
  // l(Caches)
  return Caches
}

function layerParse(layer,caches,flag){
  const {opts:{end},methods,stack,path,regexp} = layer
  if(!end){
    stack.map(v=>{
      if(v.opts) layerParse(v,caches,'inner')  
    })
  }else{
    caches.push({url:path,method:methods.join(','),params:'',code:stack&&stack.join(),pattern:regexp})
  }
}


module.exports = main