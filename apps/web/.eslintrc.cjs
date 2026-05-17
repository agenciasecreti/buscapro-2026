module.exports = {
  root: true,
  extends: ['@buscapro/eslint-config/next.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
};
