const config = require('./config.json');
const path = require('path');
const webpack = require('webpack');

/*======================================================
config
======================================================*/
// エントリーポイントファイル
const ENTRY_FILE_NAME = [
  'main',
  'sub'
];

const entries = {};
ENTRY_FILE_NAME.forEach(file => entries[file] = [
  'babel-polyfill',
  `./${config.js}/${file}.js`
]);

// babel設定
const BABEL_PRESETS = {
  presets: [
    ['env', {
      targets: { browsers: ['last 2 version'] },
      modules: false
    }],
    'stage-1',
  ],
};

/*======================================================
main
======================================================*/
module.exports = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'dest/js'),
    filename: './[name].bundle.js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: BABEL_PRESETS,
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'common',
          chunks: 'initial',
          enforce: true,
        }
      }
    }
  },
  devtool: 'eval',
}