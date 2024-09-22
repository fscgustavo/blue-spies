/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['simple-import-sort'],
  parser: '@typescript-eslint/parser',
  rules: {
    'simple-import-sort/imports': 'error',
    /**
     * Such messages are considered to be for debugging purposes and therefore not
     * suitable to ship to the client. In general, calls using console should be
     * stripped before being pushed to production.
     *
     * @see https://eslint.org/docs/latest/rules/no-console
     */
    'no-console': 'error',

    /**
     * JavaScript allows the omission of curly braces when a block contains only one statement. However,
     * it is considered by many to be best practice to never omit curly braces around blocks, even when
     * they are optional, because it can lead to bugs and reduces code clarity and consistency.
     *
     * @see https://eslint.org/docs/latest/rules/curly
     */
    curly: 'error',

    /**
     * This rule avoid bugs by disallowing expressions where the operation doesn't affect the value
     * Comparisons which will always evaluate to true or false and logical expressions (||, &&, ??)
     * which either always short-circuit or never short-circuit are both likely indications of
     * programmer error.
     *
     * @see https://eslint.org/docs/latest/rules/no-constant-binary-expression
     */
    'no-constant-binary-expression': 'error',

    /**
     * Nesting ternary expressions can make code more difficult to understand.
     *
     * @see https://eslint.org/docs/latest/rules/no-nested-ternary
     */
    'no-nested-ternary': 'warn',

    /**
     * Disallows async functions which have no await expression.
     *
     * @see https://eslint.org/docs/latest/rules/require-await
     */
    'require-await': 'error',
  },
};
