'use strict';

module.exports = {
  karma: {
    browsers: ['Chrome'],
    preprocessors: {
      'test/*.test.js': ['webpack']
    },
    reporters: ['spec'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'lcov', subdir: 'report-lcov'}
      ],
      instrumenterOptions: {
        istanbul: {noCompact: true}
      }
    },
    plugins: [
      'karma-coverage'
    ],
    autoWatch: true,
    singleRun: false
  }
};
