module.exports = {
    presets: ['@babel/preset-typescript'],
    plugins: [
        ['@babel/plugin-transform-typescript', { allowNamespaces: true }],
        ['@babel/plugin-proposal-decorators', { legacy: true }]
        // ... other
    ]
}