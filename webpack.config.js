const 
  path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin')
;

module.exports = (_, argv) => {
  let plugins = [];

  if (argv.mode === 'development') {
    plugins.push(new HtmlWebpackPlugin({
      inject: 'body',
      scriptLoading: 'blocking',
      template: './tests/index.html'
    }));
  }

  return {
    entry: {
      core: './src/core.ts',
      mask: './src/mask.ts',
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
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    plugins: plugins,
    mode: 'production'
  }
}
