module.exports = {
	entry: './pub/app.es6',
    output: {
        path: __dirname,
        filename: './pub/bundle.js'
    },
	module: {
		loaders: [
			// the optional 'runtime' transformer tells babel to require the runtime
			// instead of inlining it.
			{
				test: /pub\/.+\.es6?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader?optional[]=runtime&stage=0'
			}
		]
	},
	resolve: {
		// you can now require('file') instead of require('file.coffee')
		extensions: ['', '.js', '.json', '.es6']
	}
};
