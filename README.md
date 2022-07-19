# reciteVocabulary

## 一、项目编译打包配置
1. 开发模块使用es6模块
2. 原代码需要通过babel编译成es5运行
3. 编译后的es5通过webpack打包生成生产代码
   
## 二、命令使用
1. npm run watch  开启原代码监听，即时编译输出到dist-dev
2. npm run start  启动dist-dev中的代码
3. npm run build  把dist-dev代码打包到build文件中
4. npm run prod   启动build中的生产代码
