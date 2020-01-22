const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const createElectronReloadWebpackPlugin = require('electron-reload-webpack-plugin');
require("babel-polyfill");

// Create one plugin for both renderer and main process
const ElectronReloadWebpackPlugin = createElectronReloadWebpackPlugin({
  // Path to `package.json` file with main field set to main process file path, or just main process file path
  path: path.join(__dirname, './'),
  // or just `path: './'`,
  // Other 'electron-connect' options
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
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, 'built-app')
    },
    resolve: {
      alias: {
        'assets': path.resolve(__dirname, "src/assets")
      },
    },
    module: {
      rules: [
        { test: /\.html$/, use: ['html-loader'] },
        {
          test: /\.(scss|css)$/,
          //exclude: /node_modules/,
          //include: /src/,
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
        },
        //file-loader(for images)
        {
          test: /\.(jpg|png|gif|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: './assets/media/'
              }
            }
          ]
        },
        //file-loader(for fonts)
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      }),
      new CopyWebpackPlugin([
        { context: 'assets/media/', from: '**', to: 'assets/media/' }
      ]),
      new webpack.DefinePlugin(envKeys),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }),
      ElectronReloadWebpackPlugin(),
    ],
    devServer: {
      contentBase: path.resolve(__dirname, "built-app/assets/media"),
      stats: 'errors-only',
      open: true,
      port: 12000,
      compress: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      }
    },
    devtool: 'inline-source-map'
  };
}