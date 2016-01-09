'use strict';

module.exports = {
  karma: {
    browsers: ['Chrome'],
    preprocessors: {
      'test/*.test.js': ['webpack'],
      'dist/*.js': 'coverage'
    },
    reporters: ['spec', 'coverage', 'coveralls'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      instrumenterOptions: {
        istanbul: {noCompact: true}
      }
    },
    plugins: [
      'karma-coverage'
    ],
    autoWatch: false,
    singleRun: true
  }
};
