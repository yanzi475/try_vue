var path = require('path');
var webpack = require('webpack');

var devConfig = {
    entry: {
        app: path.resolve(__dirname, 'js/app.js')
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname)
    },
    devtool: 'source-map',
    devServer: {
        port: 9000,
        contentBase: path.join(__dirname),
        watchContentBase: true
    }
};

var prodConfig =  {
    entry: {
        app: path.resolve(__dirname, 'js/app.js')
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname)
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
}

module.exports = function (env) {
    console.log('env=' + env);
    if (env === 'dev') {
        return devConfig;
    } else {
        return prodConfig;
    }
}
