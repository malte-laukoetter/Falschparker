// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',

  parserOptions: {
    sourceType: 'module',
    parser: 'typescript-eslint-parser'
  },

  env: {
    browser: true,
    node: true
  },

  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',

  // required to lint *.vue files
  plugins: [
    'html'
  ],

  // add your custom rules here
  rules: {
    'generator-star-spacing': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ]
}
