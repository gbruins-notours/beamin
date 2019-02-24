const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        '@nuxtjs',
        'plugin:prettier/recommended'
    ],
    plugins: [
        'prettier'
    ],
    // add your custom rules here
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? ERROR : OFF,
        'no-debugger': process.env.NODE_ENV === 'production' ? ERROR : OFF,
        'vue/html-indent': 4,
        'vue/attributes-order': OFF,
        'vue/html-closing-bracket-newline': OFF
    }
}
