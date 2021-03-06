const {
    join
} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = [{
        entry: './es/snabbdom.bundle.js',
        output: {
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: 'snabbdom',
            filename: 'snabbdom.js',
            path: join(__dirname, 'dist')
        },
        devtool: "source-map"
    }, {
        entry: './es/thunk.js',
        output: {
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: 'ThunkLib',
            filename: 'thunkLib.js',
            path: join(__dirname, 'dist')
        },
        devtool: "source-map"
    }, {
        entry: './es/helpers/attachto.js',
        output: {
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: 'AttachToLib',
            filename: 'attachToLib.js',
            path: join(__dirname, 'dist')
        },
        devtool: "source-map"
    }, {
        entry: './demo/fakeRaf.js',
        output: {
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: 'fakeRaf',
            filename: 'fakeRaf.js',
            path: join(__dirname, 'dist')
        },
        devtool: "source-map"
    },
    {
        entry: {
            updateChildren: ['./demo/updateChildren.js'],
            thunk: ['./demo/thunk.js'],
            props: ['./demo/props.js'],
            attachTo: ['./demo/attachTo.js'],
            style: ['./demo/style.js']
        },
        output: {
            filename: '[name].js',
            path: join(__dirname, 'dist'),
            chunkFilename: '[name].js'
        },
        devtool: process.env.NODE_ENV === 'development' ? "source-map" : false,
        plugins: [
            new HtmlWebpackPlugin({
                title: 'updateChildren',
                chunks: [
                    'chunk-vendors',
                    'chunk-common',
                    'updateChildren'
                ],
                filename: 'index.html',
                template: 'demo/index.ejs'
            }),
            new HtmlWebpackPlugin({
                title: 'thunk',
                chunks: [
                    'chunk-vendors',
                    'chunk-common',
                    'thunk'
                ],
                filename: 'thunk.html',
                template: 'demo/index.ejs'
            }),
            new HtmlWebpackPlugin({
                title: 'props',
                chunks: [
                    'chunk-vendors',
                    'chunk-common',
                    'props'
                ],
                filename: 'props.html',
                template: 'demo/index.ejs'
            }),
            new HtmlWebpackPlugin({
                title: 'attachTo',
                chunks: [
                    'chunk-vendors',
                    'chunk-common',
                    'attachTo'
                ],
                filename: 'attachTo.html',
                template: 'demo/index.ejs'
            }),
            new HtmlWebpackPlugin({
                title: 'style',
                chunks: [
                    'chunk-vendors',
                    'chunk-common',
                    'style'
                ],
                filename: 'style.html',
                template: 'demo/index.ejs'
            })
        ]
    }
]