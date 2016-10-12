var browserSync     = require('browser-sync'),
    gulp            = require('gulp'),
    concat          = require('gulp-concat'),
    path            = require('path'),
    sass            = require('gulp-sass'),
    inlinesource    = require('gulp-inline-source'),
    inlineCss       = require('gulp-inline-css');

/**
 * Used this function to prevent errors from exiting the watch proccess
 */
function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('serve', ['sass', 'inline'], function() {

  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/css/**/*.css', ['inline']);
  gulp.watch('./src/**/*.html', ['inline']);
});

/**
 * Styles
 */
gulp.task('sass', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('inline', function () {
    gulp.src('./src/index.html')
        .pipe(inlinesource({
          compress: false
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(inlineCss({
              preserveMediaQueries: true
        }))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});


gulp.task('default', ['serve']);
