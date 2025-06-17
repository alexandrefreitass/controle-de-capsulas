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
  // ✅ dev
 devServer: {
    historyApiFallback: true, // Essencial para o React Router
    port: 3000,
    // A configuração do proxy foi ajustada para o novo formato de array
    proxy: [
      {
        context: ['/api', '/accounts'], // Caminhos a serem redirecionados
        target: 'http://localhost:8000', // Endereço do seu backend
        changeOrigin: true,
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};