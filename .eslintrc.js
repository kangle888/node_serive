module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'], // 覆盖eslint格式配置,写在最后
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    indent: [2, 4], // 4 空格缩进
    'no-undef': 2, // 不允许未声明的变量
    'no-redeclare': 2, // 禁止重复声明变量
    semi: [2, 'always'], // 语句末尾必须使用分号
    'no-console': 0, // 允许使用 console
    'arrow-spacing': [2, { before: true, after: true }], // 箭头函数的箭头前后需要空格
    'no-unused-vars': [
      1,
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
    ], // 未使用的变量作为警告
    'comma-spacing': [2, { before: false, after: true }], // 逗号后面需要空格
    'no-irregular-whitespace': 2, // 不允许不规则的空白
    'no-multiple-empty-lines': [2, { max: 1 }], // 最大连续空行数
    'eol-last': 2, // 文件末尾保留一行空行
    'keyword-spacing': [2, { before: true, after: true }], // 关键字前后需要空白
    'space-infix-ops': 2, // 操作符周围需要空格
    'space-before-blocks': [2, 'always'], // 代码块前需要空格
    'brace-style': [2, '1tbs', { allowSingleLine: true }], // 大括号风格
    'array-bracket-spacing': [2, 'never'], // 数组方括号内部不允许空格
    'object-curly-spacing': [2, 'always'], // 对象大括号内部需要空格
    'block-spacing': [2, 'always'], // 单行代码块前后需空格
    'comma-dangle': [2, 'never'], // 对象最后一个属性后不允许逗号
    'func-call-spacing': [2, 'never'], // 函数名与调用它的括号之间不允许空格
    'no-trailing-spaces': 2, // 行尾不允许空格
    'semi-spacing': [2, { before: false, after: true }] // 分号前不允许空格，后需要空格
  }
};
