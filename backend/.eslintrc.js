module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 13,
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    // allow console statements
    "no-console": 0,
    "no-underscore-dangle": 0,
  },
};
