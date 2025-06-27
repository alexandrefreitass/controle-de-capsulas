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
      // ===================================================================
      // ADICIONADO: REGRA PARA CARREGAR IMAGENS
      // ===================================================================
      // Isso permite que você importe imagens como se fossem componentes.
      // Essencial para o que vamos fazer.
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // ===================================================================
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
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
    proxy: [
      {
        context: ['/accounts', '/api'], 
        target: 'http://127.0.0.1:8000', 
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};