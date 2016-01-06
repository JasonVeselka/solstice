var gulp = require('gulp');
var karma = require('gulp-karma');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src('test.js')
    .pipe(karma({
      configFile: 'karma.conf.js'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('build-js', function() {
  return gulp.src('src/solstice.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('build-css', function(){
  return gulp.src('src/solstice.css')
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build-js', 'build-css']);
