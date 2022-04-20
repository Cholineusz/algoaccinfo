const webpack = require('webpack');
module.exports = function override(config) {
    config.resolve.fallback = {
        util: require.resolve('util/'),
        url: require.resolve('url'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );
    return config;
};