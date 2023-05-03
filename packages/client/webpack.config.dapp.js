const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = (env, argv) => {
  return {
    entry: ["@babel/polyfill", path.join(__dirname, "src")],
    output: {
      path: path.join(
        __dirname,
        argv.mode === "development" ? "dist/dapp" : "prod/dapp"
      ),
      filename: "bundle.js",
      publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", { "modules": false }],
              "@babel/preset-react",
            ],
            plugins: [
              [
                "@babel/plugin-proposal-decorators",
                {
                  "legacy": true
                }
              ],
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-json-strings"
            ]
          }
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: "./postcss.config.js",
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "assets/[name].[ext]?[hash]"
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "assets/fonts/[name].[ext]"
              }
            }
          ]
        },
        {
          test: /\.html$/,
          use: "html-loader",
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src/index.html")
      }),
      // new MiniCssExtractPlugin()
    ],
    resolve: {
      extensions: [".js", ".jsx"]
    },
    devtool: "source-map",
    devServer: {
      contentBase: path.join(__dirname, "dapp"),
      port: 5001,
      host: "0.0.0.0",
      disableHostCheck: true,
      stats: "minimal",
      historyApiFallback: true,
      open: false,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }
  };
};
