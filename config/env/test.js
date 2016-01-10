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
      dir: 'coverage/',
      reporters: [
        {type: 'lcov', dir: 'report-lcov'},
        {type: 'html', dir: 'report-html'}
      ],
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
