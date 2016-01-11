require('babel-core/register');
const path = require('path');
const appConfig = require('./config');

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['mocha', 'sinon-chai'],

    files: [
      'test/index.js'
    ],

    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    preprocessors: {
      'test/index.js': 'webpack'
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            exclude: /(src|bower_components|node_modules)/,
            loader: 'babel'
          },
          {
            test: /\.js$/,
            include: /(src)/,
            loader: 'babel-istanbul',
            query: {
              cacheDirectory: true
            }
          }
        ],
        noParse: [
          /node_modules\/sinon/
        ]
      }
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      noInfo: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: appConfig.karma.reporters,

    // lcov or lcovonly are required for generating lcov.info files
    coverageReporter: appConfig.karma.coverageReporter,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests
    // whenever any file changes
    autoWatch: appConfig.karma.autoWatch,

    // start these browsers
    // available browser launchers:
    //  https://npmjs.org/browse/keyword/karma-launcher
    browsers: appConfig.karma.browsers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: appConfig.karma.singleRun
  });
};

