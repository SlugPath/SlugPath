// Based on config from here: https://github.com/trivago/prettier-plugin-sort-imports
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  trailingComma: "all",
  semi: true,
  importOrder: ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
};
