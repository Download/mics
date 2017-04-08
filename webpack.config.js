var path = require('path');
var webpack = require('webpack');

module.exports = {
	// The base directory (absolute path!) for resolving the entry option.
	// If output.pathinfo is set, the included pathinfo is shortened to this directory.
	context: path.resolve('src'),

	module: {
		loaders: [
			{
				test: /\.js/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		],
		noParse: /\.min\.js/,
	},

	devtool: 'source-map',

	devServer: {
		stats: {
			chunks: false,
		}
	}
};
