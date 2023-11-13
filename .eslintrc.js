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
    rules: {
        'no-console': 'off',
        'object-shorthand': 'off',
        indent: 'off',
        'consistent-return': 'off',
        'no-underscore-dangle': 'off',
        'max-len': 'off',
    },
};
