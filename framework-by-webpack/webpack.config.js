const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './src/index.ts'),

    devtool: 'source-map',
    plugins: [
        // //typescript 类型检查-------------
        // new ForkTsCheckerWebpackPlugin({
        //     // 将async设为false，可以阻止Webpack的emit以等待类型检查器/linter，并向Webpack的编译添加错误。
        //     async: false
        // }),
        // // 将TypeScript类型检查错误以弹框提示
        // // 如果fork-ts-checker-webpack-plugin的async为false时可以不用
        // // 否则建议使用，以方便发现错误
        // new ForkTsCheckerNotifierWebpackPlugin({
        //     title: 'TypeScript',
        //     excludeWarnings: true,
        //     skipSuccessful: true,
        // }),
        //--------------------------------

        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Webpack Threejs-FairyGUI-Vitamin',
            template: path.resolve(__dirname, 'template.html')
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'assets'),
                to: path.resolve(__dirname, 'build/assets')
            }
        ])
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            configFile: path.resolve(__dirname, './tsconfig.json'),
                        },
                    },
                ],
                exclude: /node_modules/
            },
            // {
            //     test: /\.tsx?$/,
            //     loader: 'babel-loader',
            // },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({ terserOptions: { keep_classnames: true, compress: false,module:true,ecma:5, }, sourceMap: true })],
        //minimizer: [new UglifyJsPlugin({ uglifyOptions: { reserved: true }, sourceMap: true })],
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '_',
            name: true,
            cacheGroups: {
                three: {
                    name: 'three',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/](three)[\\/]/,
                }
            },
        }
    }
};