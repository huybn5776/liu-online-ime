module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'jest'],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'import/order': [
      2,
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    '@typescript-eslint/explicit-function-return-type': [1, {
      allowExpressions: true,
    }],
    '@typescript-eslint/lines-between-class-members': 0,
    '@typescript-eslint/no-use-before-define': 0,

    'class-methods-use-this': 1,
    'import/prefer-default-export': 0,
    'no-console': 1,
    'no-continue': 0,
    'no-useless-return': 1,
    'prettier/prettier': 0,
    'react/jsx-props-no-spreading': 0,

    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,

    'react/no-unused-prop-types': 1,
    'react/no-unused-state': 1,
    'react/require-default-props': 0,
  },
};
