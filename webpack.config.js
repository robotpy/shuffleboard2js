const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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
    entry: {
      app: ['babel-polyfill', './app.js'],
      'gyro': ['./widgets/gyro/index.js'],
      'camera': ['./widgets/camera/index.js'],
      'accelerometer': ['./widgets/accelerometer/index.js'],
      '3-axis-accelerometer': ['./widgets/3-axis-accelerometer/index.js'],
      'basic-fms-info': ['./widgets/basic-fms-info/index.js'],
      'basic-subsystem': ['./widgets/basic-subsystem/index.js'],
      'boolean-box': ['./widgets/boolean-box/index.js'],
      'combobox-chooser': ['./widgets/combobox-chooser/index.js'],
      'encoder': ['./widgets/encoder/index.js'],
      'number-bar': ['./widgets/number-bar/index.js'],
      'number-slider': ['./widgets/number-slider/index.js'],
      'relay': ['./widgets/relay/index.js'],
      'gauge': ['./widgets/gauge/index.js'],
      'text-view': ['./widgets/text-view/index.js'],
      'toggle-button': ['./widgets/toggle-button/index.js'],
      'toggle-switch': ['./widgets/toggle-switch/index.js'],
      'voltage-view': ['./widgets/voltage-view/index.js'],
      'differential-drivebase': ['./widgets/differential-drivebase/index.js'],
      'mecanum-drivebase': ['./widgets/mecanum-drivebase/index.js'],
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
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      }),
      new CopyWebpackPlugin([
        { context: 'assets/media/', from: '**', to: 'assets/media/' }
      ]),
      new webpack.DefinePlugin(envKeys),
      ElectronReloadWebpackPlugin()
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
      jquery: 'jQuery',
    },
    devtool: 'inline-source-map'
  };
}