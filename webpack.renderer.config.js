const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const path = require('path');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
    alias: {
      '@components': path.resolve(__dirname, 'src/renderer/components'),
      '@pages': path.resolve(__dirname, 'src/renderer/pages'),
      '@store': path.resolve(__dirname, 'src/renderer/store'),
      '@styles': path.resolve(__dirname, 'src/renderer/styles'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
};