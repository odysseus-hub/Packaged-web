import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored registry source (Bklit charts, Kokonut UI, shadcn/ui). It trips the React
    // Compiler lint rules in eslint-config-next 16 upstream; we lint the code we author.
    "src/components/charts/**",
    "src/components/kokonutui/**",
    "src/components/ui/**",
    "src/components/shimmering-text.tsx",
  ]),
]);

export default eslintConfig;
