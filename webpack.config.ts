import path from 'path';
import merge from 'webpack-merge';
import NodeExternals from 'webpack-node-externals';

import CleanWebpackPlugin from 'clean-webpack-plugin';

import TerserPlugin from 'terser-webpack-plugin';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import NullPlugin from 'webpack-null-plugin';

import { Configuration } from 'webpack';

const devMode = process.env.NODE_ENV === 'development';

const baseConfig: Configuration = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: 'build/',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  devtool: 'source-map',
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.pug$/,
        loader: 'file-loader',
        options: {
          name: 'views/[name].[ext]',
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
          publicPath: '../',
        },
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
      },
    ],
  },
  externals: [NodeExternals()],
};

const developmentConfig: Configuration = {
  optimization: {
    splitChunks: false,
    removeEmptyChunks: false,
  },
};

const productionConfig: Configuration = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
};

const mainConfig = merge.smart(baseConfig, {
  target: 'electron-main',
  entry: {
    main: './src/main/index.ts',
  },
  plugins: [
    devMode ? new NullPlugin() : new ForkTsCheckerWebpackPlugin({ tslint: true }), // tslint
    new MiniCssExtractPlugin(),
  ],
});

const mainDevConfig = merge.smart(mainConfig, developmentConfig);
const mainProdConfig = merge.smart(mainConfig, productionConfig);

const rendererConfig = merge.smart(baseConfig, {
  target: 'electron-renderer',
  entry: {
    splash: './src/renderer/splash.tsx',
    app: './src/renderer/app.tsx',
  },
  plugins: [new MiniCssExtractPlugin(), new CleanWebpackPlugin('build')],
});

const rendererDevConfig = merge.smart(rendererConfig, developmentConfig);
const rendererProdConfig = merge.smart(rendererConfig, productionConfig);

export default (devMode
  ? [mainDevConfig, rendererDevConfig] // dev
  : [mainProdConfig, rendererProdConfig]); // production
