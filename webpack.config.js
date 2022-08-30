let externals = _externals();

module.exports = {
  mode: 'production',
  // mode: 'development',
  target: 'node',
  // entry: './dist-dev/server.js',
  entry: './src/server.js',
  output: {
    filename: 'server.min.js',
    path: __dirname+'/build/lib'
  },
  externals
}

function _externals() {
  let manifest = require('./package.json');
  let dependencies = manifest.dependencies;
  let externals = {};
  for (let p in dependencies) {
    externals[p] = 'commonjs ' + p;
  }
  return externals;
}