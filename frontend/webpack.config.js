// C:\Users\Xandy\Desktop\CNC\frontend\webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  // ===================================================================
  // CORREÇÃO DA SINTAXE DO PROXY
  // ===================================================================
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all',
    hot: true,
    open: false,
    historyApiFallback: true,

    // A SINTAXE CORRETA PARA WEBPACK DEV SERVER v5+
    // O proxy agora é um ARRAY de objetos.
    proxy: [
      {
        // O 'context' define quais caminhos serão interceptados.
        context: ['/accounts', '/api'], 
        // 'target' é para onde vamos encaminhar essas requisições.
        target: 'http://127.0.0.1:8000', 
      },
    ],
  },
  // ===================================================================
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};