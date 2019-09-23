import path from 'path';
import { Configuration } from 'webpack';
import Dotenv from 'dotenv-webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { GenerateSW } from 'workbox-webpack-plugin';

const isProduction: boolean = process.env.NODE_ENV === 'production';

const fileName = isProduction ? '[name].[chunkhash]' : '[name]';

const distDir = path.resolve(__dirname, 'dist');

const appTitle = isProduction
  ? '三国志大戦デッキシミュレーター'
  : '三国志大戦デッキシミュレーター(local)';

const config: Configuration = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    deck: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    path: distDir,
    filename: `scripts/${fileName}.js`,
  },
  devtool: isProduction ? false : 'inline-source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            // ライセンスは別で出力しているためjsからは除去
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  plugins: [
    new Dotenv({ systemvars: true, defaults: true }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: isProduction ? ['scripts', 'styles'] : [],
    }),
    new MiniCssExtractPlugin({
      filename: `styles/${fileName}.css`,
    }),
    new HtmlWebpackPlugin({
      title: appTitle,
      template: path.resolve(__dirname, 'src/index.html.ejs'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProduction,
        removeComments: isProduction,
      },
    }),
    new GenerateSW({
      swDest: 'service-worker.js',
      precacheManifestFilename: 'scripts/precache-manifest.[manifestHash].js',
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /\.md5$/gi,
          handler: 'NetworkFirst',
        },
        {
          urlPattern: /^https:\/\/3594t\.net\/img\/.*\.(jpg|png|gif)$/gi,
          handler: 'CacheFirst',
          options: {
            cacheName: '3594t.net/img',
            expiration: {
              maxAgeSeconds: 3 * 86400,
            },
          },
        },
      ],
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
