const profix = "/src/middleware/filter"

async function filter(ctx,next){
  const {user,userid} = ctx.session
  let whiteUrl = ['/pages/login','/lib/mui/style.css','/user/login','/user/register','/favicon.ico']
  if(!userid && !whiteUrl.includes(ctx.path)){
    printErrlog(profix,'filter',"此请求被白名单过滤： user:"+user+' path:'+ctx.path)
    return ctx.redirect('/pages/login')
  }
  await next()
}

module.exports = filter