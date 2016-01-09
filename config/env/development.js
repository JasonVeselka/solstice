'use strict';

module.exports = {
  karma: {
    browsers: ['Chrome'],
    preprocessors: {
      'test/*.test.js': ['webpack']
    },
    reporters: ['spec'],
    autoWatch: true,
    singleRun: false
  }
};
