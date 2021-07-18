module.exports = {
  preset: 'jest-preset-stylelint',
  setupFiles: ['./src/setupTests.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
