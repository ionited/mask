const 
  path = require('path'),
  FileManagerPlugin = require('filemanager-webpack-plugin'),
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
  } else {
    plugins.push(new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            { source: './dist/masks', destination: './masks' },
            { source: './dist/core.d.ts', destination: './core/index.d.ts' },
            { source: './dist/core.js', destination: './core/index.js' }
          ]
        }
      }
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
