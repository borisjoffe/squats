module.exports = {
	entry: './pub/app.js',
	module: {
		loaders: [
			// the optional 'runtime' transformer tells babel to require the runtime
			// instead of inlining it.
			{
				test: /\.es6?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader?optional[]=runtime'
			}
		]
	}
};
