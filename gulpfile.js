var gulp = require('gulp');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var named = require('vinyl-named');

gulp.task('bundle-js', function() {
  var w = webpack({
    output: {
      filename: '[name].js'
    }
  });
  w.on('error', function(e) {
    this.emit('end');
  });
  return gulp.src('src/js/*.js')
    .pipe(named())
    .pipe(w)
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.basename += ".min"
    }))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('compile-sass', function() {
  return gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: 'last 2 versions' }))
    .pipe(rename(function(path) {
      path.extname = ".css"
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
    .pipe(cleanCSS())
    .pipe(rename(function(path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest('./dist/css'))
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

  gulp.watch('./*.js').on('change', browserSync.reload);
  gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('serve-gh-pages', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: '..',
      index: 'automate-forms/index.html',
    }
  });

  gulp.watch('./*.js').on('change', browserSync.reload);
  gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
