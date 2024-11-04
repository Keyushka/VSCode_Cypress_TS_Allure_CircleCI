import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import chaiFriendly from "eslint-plugin-chai-friendly";
import prettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.browser },
    plugins: { 
      "chai-friendly": chaiFriendly,
      "prettier": prettier
    },
    rules: {
      "no-unused-expressions": "off",
      "chai-friendly/no-unused-expressions": "error",
      "prettier/prettier": "error"
    },
    extends: ["plugin:prettier/recommended"],
    ...pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
  },
];
