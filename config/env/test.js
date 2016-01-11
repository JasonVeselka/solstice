'use strict';

module.exports = {
  karma: {
    browsers: ['Firefox'],
    reporters: ['spec', 'coverage', 'coveralls'],
    coverageReporter: {
      dir: 'coverage/',
      type: 'lcov'
    },
    plugins: [
      'karma-webpack',
      'karma-coverage',
      'karma-firefox-launcher'
    ],
    autoWatch: false,
    singleRun: true
  }
};
