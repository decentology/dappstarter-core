const path = require("path");

module.exports = {

  entry: {
    'DappLib': path.join(__dirname, "src/lib/dapp-lib")
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].min.js",
    sourceMapFilename: "[name].min.js.map",
    library: "[name]",
    libraryExport: "default",
    libraryTarget: "umd",
    globalObject: "this"
  },
 // externals: dependencies,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [

  ],
  resolve: {
    extensions: [".js"]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    host: "0.0.0.0",
    stats: "minimal"
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
