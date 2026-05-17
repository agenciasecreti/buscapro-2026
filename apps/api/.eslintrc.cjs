module.exports = {
  root: true,
  extends: ['@buscapro/eslint-config/node.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  // prisma/ contém scripts (seed) fora do tsconfig de build (src only).
  ignorePatterns: ['dist', 'node_modules', 'prisma/**'],
};
