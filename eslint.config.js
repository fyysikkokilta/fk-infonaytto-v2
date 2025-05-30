import globals from "globals"
import tsParser from "@typescript-eslint/parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [{
  ignores: ["build/*"],
}, ...compat.extends("eslint:recommended", "prettier"), {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },

    parser: tsParser,
    ecmaVersion: 5,
    sourceType: "module",
  },

  rules: {
    "react-hooks/exhaustive-deps": "off",
    semi: ["error", "never"],
    indent: ["error", 2],
  },
}, {
  files: ["**/*.tsx"],

  rules: {
    "no-undef": "off",
  },
}]