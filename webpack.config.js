const NodeExternals = require('webpack-node-externals');
const path = require('path');
const merge = require('webpack-merge');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const NullPlugin = require('webpack-null-plugin');

const devMode = process.env.NODE_ENV === 'development';

const baseConfig = {
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
    extensions: ['.tsx', '.ts', '.js', '.json'],
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

const developmentConfig = {
  optimization: {
    splitChunks: false,
    removeEmptyChunks: false,
  },
};

const productionConfig = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
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
    devMode
      ? new NullPlugin()
      : new ForkTsCheckerWebpackPlugin({ tslint: true }),
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

module.exports = devMode
  ? [mainDevConfig, rendererDevConfig]
  : [mainProdConfig, rendererProdConfig];
