var path = require('path');

module.exports = {
	entry: './pub/app.js',
    output: {
        path: path.join(__dirname, 'pub'),
        filename: 'bundle.js'
    },
	module: {
		loaders: [
			// the optional 'runtime' transformer tells babel to require the runtime
			// instead of inlining it.
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader?optional[]=runtime&stage=0'
				// sourceMaps=both
			}
		]
	},
	resolve: {
		// you can now require('file') instead of require('file.coffee')
		root: path.join(__dirname, 'pub'),
		extensions: ['', '.js', '.json']
	}
};
