// Generated by CoffeeScript 2.6.0
(function() {
  var path;
  path = require("path");

  module.exports = function(shipit) {
    var APP_ID, SHARED_DIRS;
    require('shipit-deploy')(shipit);
    
    APP_ID = 'recite'
    SHARED_DIRS = ['node_modules','log']
    
    shipit.initConfig({
      default: {
        deployTo: `/var/apps/${APP_ID}`,
        repositoryUrl: "",
        keepWorkspace: true,
        keepReleases: 8,
        dirToCopy: "build",
        rsyncFrom: "."
      },
      "prod": { // 试生产日志输出服务器      权重10
        servers: ["root@ali"],
        pm2File: "pm2-prod.json",
        deployTo: `/var/apps/${APP_ID}/`,
        skipNpmInstall: true,
        // skipNpmInstall: false,
        // skipBuild: true
        skipBuild: false
      }
    })

    shipit.task('deploy:fetch', async function() {
      shipit.workspace = shipit.config.workspace
      let env = shipit.environment;
      if(!shipit.globalConfig[env].skipBuild) await shipit.start('build:local')
      shipit.emit('fetched')
    });

    // 准备好远端服务器部署的共享目录
    shipit.blTask('prepar:remote', async function() {
      await shipit.remote(`mkdir -p  ${path.join(shipit.releasesPath, "../shared")} && cd ${path.join(shipit.releasesPath, "../shared")} && mkdir -p ${SHARED_DIRS.join(" ")}`);
    });

    // 本地编译
    shipit.blTask('build:local', async function() {
      let env = shipit.environment;
      console.log("[Task] build-local");
      await shipit.local("pwd");
      await shipit.local("rm -rf ./build");
      await shipit.local("mkdir -pv ./build/lib");
      await shipit.local("./node_modules/.bin/webpack");
      await shipit.local("cp -Rv package.json build/ ");
      await shipit.local("cp -Rv public build/ ");
      await shipit.local("cp -Rv script build/ ");
      await shipit.local("cp -Rv views build/ ");
      await shipit.local(`cp -Rv pm2-prod.json build/`);
      await shipit.local(`cp -Rv ${shipit.globalConfig[env].pm2File} build/`);
    })


    shipit.blTask('npm:install', async function() {
      let env = shipit.environment;
      await shipit.remote(`cd ${path.join(shipit.globalConfig[env].deployTo, "current")} && cnpm i --production`);
    })

    shipit.blTask('deploy:link-remote', async function() {
      let env = shipit.environment
      let len = SHARED_DIRS.length
      for (let i = 0; i < len; i++) {
        let dir = SHARED_DIRS[i];
        await shipit.remote(`ln -s ${path.join(shipit.releasesPath, `../shared/${dir}`)}  ${path.join(shipit.releasePath, `./${dir}`)}`);
      }
      if(!shipit.globalConfig[env].skipNpmInstall) await shipit.start('npm:install')
    })

    shipit.blTask('pm2:start', async function() {
      let env = shipit.environment;
      await shipit.remote(`pm2 start ${path.join(shipit.globalConfig[env].deployTo, 'current', shipit.globalConfig[env].pm2File)}`);
    })

    shipit.blTask('pm2:delete', async function() {
      await shipit.remote(`pm2 delete ${APP_ID}-${shipit.environment} || echo OK`);
    });
    
    // 部署前 准备好远端 共享目录
    shipit.on("deploy", async function() {
      await shipit.start('prepar:remote');
    });
    // 文件上传到远端完成后 软连接 共享目录
    shipit.on("cleaned", async function() {
      await shipit.start('deploy:link-remote');
    });
    shipit.on("deployed", async function() {
      await shipit.start('pm2:delete');
      await shipit.start('pm2:start');
    });
  };

}).call(this);
