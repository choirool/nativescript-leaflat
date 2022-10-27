const webpack = require("@nativescript/webpack");
const path = require('path');

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack
	webpack.Utils.addCopyRule('**/*.html')
	// webpack.Utils.addCopyRule({
	// 	from: './www/index.html',
	// 	to: 'app/www',
	// 	// the context of the "from" rule, in this case node_modules
	// 	// we used the getProjectFilePath util here, but this could have been
	// 	// a path.resolve(__dirname, 'node_modules') too.
	// 	// context: webpack.Utils.project.getProjectFilePath('./app')
	// 	// context: path.resolve(__dirname, 'app')
	// })

	return webpack.resolveConfig();
};


