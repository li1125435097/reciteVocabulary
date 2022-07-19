const router = new Router({prefix:'/pages'})
import { readFileSync } from 'fs'
let files = {}

// 空路径返回缓存的html文件列表
router.get('/', function (ctx) {
    ctx.body = Object.keys(files)
})


// 访问具体页面，直接返回缓存数据
router.get('/:page', function (ctx) {
    let page = ctx.params['page']
    ctx.type = 'text/html'
    ctx.body = loadFile(page)
    files = {}            // 清空文件缓存，测试或开发环境时开启
})



// html文件获取函数，初次加载时html文件加载到内存
function loadFile(fname){ 
    if(!files[fname]){
        let html = readFileSync(Join(VIEWS,fname+'.html'))
        files[fname] = html 
    }
    return files[fname] 
}


module.exports = router.routes()