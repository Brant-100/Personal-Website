import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

const reactRecommended = react.configs.flat.recommended;
const reactJsxRuntime = react.configs.flat["jsx-runtime"];

export default [
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  // Node: Vite, Tailwind, PostCSS config files
  {
    files: [
      "vite.config.js",
      "tailwind.config.js",
      "postcss.config.js",
      "eslint.config.js",
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ...reactRecommended.languageOptions,
      ...reactJsxRuntime.languageOptions,
      globals: {
        ...globals.browser,
        // Injected by Vite define in vite.config.js
        __BUILD_DATE__: "readonly",
      },
    },
    plugins: {
      ...reactRecommended.plugins,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactRecommended.rules,
      ...reactJsxRuntime.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "react/prop-types": "off",
    },
  },
  // shadcn/ui + motion + context: non-component exports (variants, spring config, constants)
  {
    files: [
      "src/components/ui/**/*.{js,jsx}",
      "src/components/motion/**/*.{js,jsx}",
      "src/context/**/*.{js,jsx}",
      "src/components/sections/Contact.jsx",
    ],
    rules: { "react-refresh/only-export-components": "off" },
  },
];
