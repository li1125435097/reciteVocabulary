// Generated by CoffeeScript 2.3.1
(function() {
  var getPrefix, l, main, r;

  l = console.log;

  r = function(p) {
    return l(Reflect.ownKeys(p));
  };

  main = function(app) {
    var results, routers;
    routers = app._router.stack;
    results = [];
    routers.map(function(v) {
      var prefix;
      if (v.name === 'router') {
        prefix = getPrefix(v);
        return v.handle.stack.map(function(v1) {
          var methods, path, ref, stack;
          ({path, stack, methods} = (ref = v1.route) != null ? ref : {});
          stack = stack && stack.map(function(v3) {
            return v3.name;
          });
          return results.push({
            type: '路由',
            url: prefix + String(path || '').slice(1).replace(/\//g, '\\'),
            method: methods && Object.keys(methods).join(),
            func: (stack != null ? stack.join() : void 0) || v1.name
          });
        });
      } else {
        // l('中间件',v.name,v.handle.toString().split(' {')[0])
        // l(prefix+String(path).slice(1),stack,methods)
        // methods || l(prefix,v1)
        return results.push({
          type: '中间件',
          name: v.name,
          func: v.handle.toString().split('{')[0]
        });
      }
    });
    // l(routers[58].handle.stack[0])
    return l(results);
  };

  getPrefix = function(route) {
    return route.regexp.toString().split('\/').slice(2, -3).join('').split('^').pop();
  };

  module.exports = main;

}).call(this);