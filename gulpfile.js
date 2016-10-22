var gulp = require('gulp');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();

gulp.task('bundle-js', function() {
  var w = webpack();
  w.on('error', function(e) {
    this.emit('end');
  });
  return gulp.src('src/js/index.js')
    .pipe(w)
    .pipe(rename('automate-forms.js'))
    .pipe(gulp.dest('.'))
    .pipe(uglify())
    .pipe(rename('automate-forms.min.js'))
    .pipe(gulp.dest('.'))
});

gulp.task('compile-sass', function() {
  return gulp.src('src/sass/automate-forms.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('automate-forms.css'))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream())
    .pipe(cleanCSS())
    .pipe(rename('automate-forms.min.css'))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch('src/sass/**/*.scss', ['compile-sass']);
  return gulp.watch('src/js/**/*.js', ['bundle-js']);
});

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: '.',
      index: 'demo.html',
    }
  });

  // gulp.watch(['./automate-forms.css', './automate-forms.min.css']).on('change', browserSync.stream);
  gulp.watch('./*.js').on('change', browserSync.reload);
});
