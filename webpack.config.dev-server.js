const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// Importe outros plugins conforme necessário

module.exports = {
  mode: 'development',
  entry: './src/index.js', // Ajuste conforme o ponto de entrada da sua aplicação
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // Outras regras conforme necessário para seu projeto
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html', // Ajuste conforme o caminho do seu arquivo HTML
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css'
    })
    // Outros plugins conforme necessário
  ],
  devServer: {
    host: '0.0.0.0', // Permite acesso externo
    port: 3000,
    historyApiFallback: true,
    hot: true,
    proxy: [
      {
        context: ['/api', '/admin', '/static'],
        target: 'http://localhost:8000', // Ajuste para o endereço correto do seu backend
        secure: false,
        changeOrigin: true
      }
    ],
    client: {
      overlay: true,
    },
  },
  devtool: 'source-map'
};