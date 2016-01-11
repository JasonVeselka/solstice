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
      'karma-coverage'
    ],
    autoWatch: false,
    singleRun: true
  }
};
