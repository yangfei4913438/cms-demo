module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  overrides: [
    {
      files: '*.{js,ts,jsx,tsx,css,scss,json,md,mdx,yaml,yml}',
      options: {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        printWidth: 100,
      },
    },
  ],
};
