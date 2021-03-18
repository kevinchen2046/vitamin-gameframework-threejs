module.exports = {
    presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env', 'mobx'],
    plugins: [
        ['@babel/plugin-transform-typescript', { allowNamespaces: true }],
        // ... other
    ]
}