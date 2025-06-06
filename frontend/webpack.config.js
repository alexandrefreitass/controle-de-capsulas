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
    extensions: ['.js', '.jsx']
  },
  // ✅ CONFIGURAÇÃO DO SERVIDOR DE DESENVOLVIMENTO COM PROXY
  devServer: {
    historyApiFallback: true, // Essencial para o React Router
    port: 3000, // O Frontend roda na porta 3000
    allowedHosts: 'all', // Permite o acesso via URL do Replit
    // A mágica acontece aqui!
    proxy: {
      // Se o webpack-dev-server receber uma requisição para /api/...
      '/api': {
        // ...ele a redireciona para o nosso backend Django.
        target: 'http://localhost:8000',
        // Muda a origem da requisição para o target, crucial para CORS
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
