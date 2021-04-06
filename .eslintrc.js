module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'esnext',
    'esnext/style-guide',
    'node',
    'node/style-guide',
    'react-native',
    'react-native/style-guide',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    indent: [ 'error', 2 ],
    'react/jsx-indent': [ 'error', 2 ],
    'react/no-unescaped-entities': 'off',
    'import/no-commonjs': 'off',
    'import/no-unresolved': 'off',
    'react/jsx-sort-props': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-no-bind': 'off',
    'sort-imports': 'off',
    'react/jsx-pascal-case': 'off',
    'operator-linebreak': 'off',
    'no-useless-escape': 'off',
    'no-irregular-whitespace': 'off',
  },
}
