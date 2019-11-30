const {
    join
} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = [{
        entry: './snabbdom/es/snabbdom.bundle.js',
        output: {
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: 'snabbdom',
            filename: 'snabbdom.js',
            path: join(__dirname, 'dist')
        },
        devtool: "source-map"
    },
    {
        entry: './demo/app.js',
        output: {
            filename: 'bundle.js',
            path: join(__dirname, 'dist')
        },
        devtool: "source-map",
        plugins: [
            new HtmlWebpackPlugin({
                title: 'snabbdom',
                template: 'demo/index.ejs'
            })
        ]
    }
]