// eslint-disable-next-line import/no-extraneous-dependencies
const getTestRule = require('jest-preset-stylelint/getTestRule');

global.testRule = getTestRule({ plugins: ['./src/index.js'] });
