module.exports = {
	entry: './pub/app.js',
    output: {
        path: __dirname,
        filename: 'pub/bundle.js'
    },
	module: {
		loaders: [
			// the optional 'runtime' transformer tells babel to require the runtime
			// instead of inlining it.
			{
				test: /\.es6?$/,
				exclude: /(node_modules|bower_components)/,
				include: 'pub',
				loader: 'babel-loader?optional[]=runtime'
			}
		]
	}
};
