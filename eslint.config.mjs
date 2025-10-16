// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: [
      "src/generated/**/*",
      "**/generated/**/*",
      "node_modules/**/*",
      ".next/**/*",
      "out/**/*",
      "build/**/*",
      "dist/**/*",
      "**/*.d.ts",
      "**/prisma/runtime/**/*",
    ],
  },

  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },

  // Disable style warnings for PDF components (react-pdf/renderer requires inline styles)
  {
    files: [
      "**/PrintableForms/**/*.tsx",
      "**/PrintableForms/**/*.ts",
      "**/form-components/**/page_*.tsx",
      "**/components-server/**/*.tsx",
      "**/api/**/route.tsx", // API routes that generate PDFs
      "**/api/**/route.ts",
    ],
    rules: {
      "@next/next/no-css-tags": "off",
      "@next/next/no-styled-jsx-in-document": "off",
      "@next/next/no-sync-scripts": "off",
      "react/forbid-dom-props": "off",
      "react/forbid-component-props": "off",
      "jsx-a11y/alt-text": "off", // react-pdf/renderer Image doesn't support alt prop
      "react/no-unknown-property": "off", // Allow style prop for PDF components
    },
  },
];

export default eslintConfig;
