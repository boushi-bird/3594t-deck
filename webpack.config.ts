import path from 'path';
import { Configuration } from 'webpack';
import Dotenv from 'dotenv-webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

const isProduction: boolean = process.env.NODE_ENV === 'production';

const fileName = isProduction ? '[name].[chunkhash]' : '[name]';

const distDir = 'dist';

const config: Configuration = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    deck: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, distDir),
    filename: `scripts/${fileName}.js`,
  },
  devtool: isProduction ? false : 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  plugins: [
    new Dotenv({ systemvars: true, defaults: true }),
    new CleanWebpackPlugin(
      isProduction
        ? [path.join(distDir, 'scripts'), path.join(distDir, 'styles')]
        : []
    ),
    new MiniCssExtractPlugin({
      filename: `styles/${fileName}.css`,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProduction,
        removeComments: isProduction,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: path.resolve(__dirname, 'src'),
  },
};

export default config;
