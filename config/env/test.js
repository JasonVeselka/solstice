'use strict';

module.exports = {
  karma: {
    browsers: ['Chrome'],
    reporters: ['spec', 'coverage', 'coveralls'],
    coverageReporter: {
      dir: 'coverage/',
      type: 'lcov'
    },
    plugins: [
      'karma-webpack',
      'karma-coverage',
      'karma-chrome-launcher'
    ],
    autoWatch: false,
    singleRun: true
  }
};
