import antfu from "@antfu/eslint-config";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu(
    {
      unocss: true,
      formatters: true,
    },
    {
      rules: {
        // Allow trailing spaces in comments
        noTrailingSpaces: ["error", { ignoreComments: true }],
        "style/no-trailing-spaces": "off", // needs quotes due to slash

        maxStatementsPerLine: ["warn", { max: 2 }],
        "style/max-statements-per-line": "off",

        quotes: "off",
        "style/quotes": "off",

        semi: "off",
        "style/semi": "off",

        commaDangle: "off",
        "style/comma-dangle": "off",

        operatorLinebreak: "off",
        "style/operator-linebreak": "off",

        "antfu/if-newline": "off",

        braceStyle: "off",
        "style/brace-style": "off",
      },
    },
    {
      files: ["**/*.md"],
      rules: {
        "style/no-trailing-spaces": "off",
      },
    }
  )
);
