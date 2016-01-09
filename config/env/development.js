'use strict';

module.exports = {
  karma: {
    browsers: ['Chrome'],
    preprocessors: {
      'test/*.test.js': ['webpack']
    },
    reporters: ['spec', 'junit', 'html'],
    autoWatch: true,
    singleRun: false
  }
};
