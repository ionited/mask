const path = require('path');

module.exports = {
  entry: {
    'core/index': './src/core.ts',
    'masks/default': './src/masks/default.ts',
    'masks/number': './src/masks/number.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: __dirname
  },
  mode: 'production'
}
