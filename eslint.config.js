import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigESLint from "eslint-config-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...eslintConfigESLint,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    ignores: ["node_modules/"],
    plugins: {
      "eslint-plugin": pluginJs,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": ["error"],
    },
  },
];
