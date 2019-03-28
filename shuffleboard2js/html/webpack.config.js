const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
require("babel-polyfill");

module.exports = (env = {}) => {

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    context: path.resolve(__dirname, "src"),
    entry: {
      app: ['babel-polyfill', './app.js'],
      'gyro': ['./widgets/gyro/index.js'],
      'camera': ['./widgets/camera/index.js'],
      'accelerometer': ['./widgets/accelerometer/index.js'],
      '3-axis-accelerometer': ['./widgets/3-axis-accelerometer/index.js'],
      'basic-fms-info': ['./widgets/basic-fms-info/index.js'],
      'boolean-box': ['./widgets/boolean-box/index.js'],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      alias: {
        'assets': path.resolve(__dirname, "src/assets"),
        'modules': path.resolve(__dirname, "src/modules")
      },
    },
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' }
        },
        {
          test: /\.js$/,
          include: /src/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread", 
                "@babel/plugin-syntax-dynamic-import",
                "@babel/plugin-transform-regenerator"
              ]
            }
          }
        },
        {
          test: /\.tag$/,
          exclude: /node_modules/,
          use: [{
            loader: 'riot-tag-loader',
            options: {
              hot: true, // set it to true if you are using hmr
              // add here all the other riot-compiler options riot.js.org/guide/compiler/
              // template: 'pug' for example
            }
          }],
        },
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
      new CopyWebpackPlugin([
        { context: 'assets/media/', from: '**', to: 'assets/media/' }
      ]),
      new webpack.DefinePlugin(envKeys)
    ],
    devServer: {
      contentBase: path.resolve(__dirname, "dist/assets/media"),
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
    externals: {
      riot: 'riot',
      jquery: 'jQuery'
    },
    devtool: 'inline-source-map'
  };
}