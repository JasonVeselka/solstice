'use strict';

module.exports = {
  karma: {
    browsers: ['Chrome'],
    reporters: ['spec', 'coverage', 'coveralls'],
    coverageReporter: {
      dir: 'coverage/',
      type: 'lcov'
    },
    Chrome_travis_ci: {
      base: 'Chrome',
      flags: ['--no-sandbox', '--user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4"']
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
