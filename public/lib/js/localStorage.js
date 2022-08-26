// localStorage操作
function addl(key,val){
  let type = typeof val
  if(type === 'string' || type === 'number') localStorage.setItem(key,val)
  else localStorage.setItem(key,JSON.stringify(val)+'obj')

  return localStorage.getItem(key)
}

function getl(key){
  let data = localStorage.getItem(key)
  if(data === null) return data
  if(data.slice(-3) === 'obj') data=JSON.parse(data.slice(0,-3))
  return data
}

function dell(key){
  localStorage.removeItem(key)
}

// sessionStorage操作
function adds(key,val){
  let type = typeof val
  if(type === 'string' || type === 'number') sessionStorage.setItem(key,val)
  else sessionStorage.setItem(key,JSON.stringify(val)+'obj')

  return sessionStorage.getItem(key)
}

function gets(key){
  let data = sessionStorage.getItem(key)
  if(data === null) return data
  if(data.slice(-3) === 'obj') data=JSON.parse(data.slice(0,-3))
  return data
}

function dels(key){
  sessionStorage.removeItem(key)
}