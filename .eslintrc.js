module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: 'airbnb-base',
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                '.eslintrc.{js,cjs}',
            ],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@root', '.'],
                    ['@config', './configs'],
                    ['@controllers', './controllers'],
                    ['@helpers', './helpers'],
                    ['@middlewares', './middlewares'],
                    ['@models', './models'],
                    ['@routes', './routes'],
                    ['@services', './services'],
                    ['@utils', './utils'],
                ],
                extensions: ['.js', '.json', '.node'],
            },
        },
    },
    rules: {
        'no-console': 'off',
        'object-shorthand': 'off',
        indent: 'off',
        'consistent-return': 'off',
        'no-underscore-dangle': 'off',
        'max-len': 'off',
        'prefer-destructuring': 'off',
    },
};