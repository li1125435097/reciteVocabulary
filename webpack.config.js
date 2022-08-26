const path = require('path');

module.exports = {
  mode: 'production',
  // mode: 'development',
  target: 'node',
  // entry: './dist-dev/server.js',
  entry: './src/server.js',
  output: {
    filename: 'server.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};