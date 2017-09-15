var browserSync     = require('browser-sync'),
    gulp            = require('gulp'),
    concat          = require('gulp-concat'),
    path            = require('path'),
    sass            = require('gulp-sass'),
    inlinesource    = require('gulp-inline-source'),
    inlineCss       = require('gulp-inline-css'),
    php2html        = require('gulp-php2html')
    ngrok           = require('ngrok');

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
  }, function (err, bs) {
    ngrok.connect(bs.options.get('port'), function (err, url) {
      // https://757c1652.ngrok.com -> 127.0.0.1:8080  
    }); 
  });

  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/css/**/*.css', ['inline']);
  gulp.watch('./src/**/*.php', ['inline']);
});

/**
 * Styles
 */
gulp.task('sass', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('inline', function () {
    gulp.src('./src/*.php')
        .pipe(php2html())
        .pipe(inlinesource({
          compress: false
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(inlineCss({
              preserveMediaQueries: true,
              applyWidthAttributes: true,
              applyHeightAttributes: true,
              applyCenterAttributes: true,
        }))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
