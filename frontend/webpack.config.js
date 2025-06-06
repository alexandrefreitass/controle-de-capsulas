const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules'],
    fallback: {
      "path": false,
      "fs": false
    }
  },
  // ✅ CONFIGURAÇÃO DO SERVIDOR DE DESENVOLVIMENTO COM PROXY CORRIGIDA
  devServer: {
    historyApiFallback: true, // Essencial para o React Router
    port: 3000,
    allowedHosts: 'all', 
    proxy: {
      // Redireciona tudo que for /api/* para o backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // ✅ ADICIONADO: Redireciona também /accounts/* para o backend
      '/accounts': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};