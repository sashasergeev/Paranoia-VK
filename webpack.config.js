const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    popup: "./src/popup.jsx",
    background: "./src/background.js",
    contentscript: "./src/contentscript.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      // manage manifest.json file
      patterns: [{ from: "public" }, { from: "src/styles" }],
    }),
    new HtmlWebpackPlugin({
      // manage .html
      template: "./src/popup.html",
      filename: "popup.html",
    }),
    new CleanWebpackPlugin(),
  ],
};
