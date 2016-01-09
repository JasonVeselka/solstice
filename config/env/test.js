'use strict';

module.exports = {
  karma: {
    browsers: ['Chrome'],
    preprocessors: {
      'test/*.test.js': ['webpack'],
      'dist/*.js': 'coverage'
    },
    reporters: ['progress', 'coverage', 'coveralls'],
    autoWatch: false,
    singleRun: true
  }
};
