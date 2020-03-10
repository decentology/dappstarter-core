const path = require("path");
const glob = require("glob");

module.exports = (env, argv) => {

  return {
    entry: {
      'DappLib': glob.sync("./src/lib/**/*.js")
    },
    output: {
      path: path.join(__dirname, (argv.mode === "development" ? "dist" : "prod")),
      filename: "[name].min.js",
      sourceMapFilename: "[name].min.js.map",
      library: "[name]",
      libraryExport: "default",
      libraryTarget: "umd",
      globalObject: "this"
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      }]
    },
    plugins: [

    ],
    resolve: {
      extensions: [".js"]
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  }
};