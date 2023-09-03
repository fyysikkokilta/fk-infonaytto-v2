const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require("path")

module.exports = {
  entry: "./src/index.tsx",
  devtool: "source-map",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'public/js'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.mp4$/,
        use: 'file-loader?name=videos/[name].[ext]',
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', ".tsx"]
  },
  devServer: {
    port: 3020,
    open: true,
    hot: true,
    proxy: {
      "/api/*": {
        target: "http://localhost:3010"
      }
    }
  },
  plugins: [new HtmlWebpackPlugin({
    template: "public/index.html",
    hash: true, // cache busting
    filename: '../build/index.html'
  }),
  new MiniCssExtractPlugin({
    filename: 'style.css'
  })]
}