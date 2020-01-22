const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const createElectronReloadWebpackPlugin = require('electron-reload-webpack-plugin');
require("babel-polyfill");

const ElectronReloadWebpackPlugin = createElectronReloadWebpackPlugin({
  path: path.join(__dirname, './'),
  logLevel: 0
});

module.exports = (env = {}) => {

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    context: path.resolve(__dirname, "src"),
    target: 'electron-renderer',
    entry: ['babel-polyfill', './app.js'],
    output: {
      filename: "app.js",
      path: path.resolve(__dirname, 'build')
    },
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        { context: 'assets/media/', from: '**', to: 'assets/media/' }
      ]),
      new webpack.DefinePlugin(envKeys),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }),
      ElectronReloadWebpackPlugin(),
    ],
    devtool: 'inline-source-map'
  };
}