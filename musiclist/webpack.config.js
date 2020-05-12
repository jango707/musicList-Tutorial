const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	context: resolve(__dirname, 'src'),
	entry: [
		'react-hot-loader/patch',
		'react-hot-loader/babel',
		'webpack-hot-middleware/client',		
		'./index.jsx',
	],
	output: {
		filename: 'javascripts/build.js',
		path: '/',
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.jsx'],

	},
	module: {
		rules: [
		{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components|public\/)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-react']
				}
			}

		},
		{
			test: /\.css$/,
			use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './public/stylesheets',
            },
          },
          'css-loader',
        ],
		},
		{
			test: /\.scss$/,
			use: [
			'style-loader',
			'css-loader',
			'sass-loader',
		],
		} 
	  ],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
		//new ExtractTextPlugin('stylesheets/style.css'),
	],
};
