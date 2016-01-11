'use strict';

module.exports = {
  karma: {
    browsers: ['Chrome'],
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      type: 'text'
    },
    plugins: [
      'karma-webpack',
      'karma-coverage',
      'karma-chrome-launcher'
    ],
    autoWatch: true,
    singleRun: false
  }
};
