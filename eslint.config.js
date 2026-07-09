import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    settings: { react: { version: "detect" } },
    plugins: { "react-refresh": reactRefresh, "react-hooks": reactHooks },
    rules: {
      // Only the classic hooks rules (matches the previous eslint-plugin-react-hooks@4
      // "recommended" set). The newer React Compiler lint rules (set-state-in-effect,
      // immutability, purity, etc.) are intentionally left out here, since enabling them
      // surfaces hundreds of pre-existing pattern warnings unrelated to this dependency
      // upgrade. Consider opting into them as a separate, dedicated cleanup effort.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
