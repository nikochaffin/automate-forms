var gulp = require('gulp');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');

gulp.task('bundle', function() {
  var w = webpack();
  w.on('error', function(e) {
    this.emit('end');
  });
  return gulp.src('src/forms.js')
    .pipe(w)
    .pipe(rename('automate-forms.js'))
    .pipe(gulp.dest('.'))
    .pipe(uglify())
    .pipe(rename('automate-forms.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  return gulp.watch('src/**/*.js', ['bundle']);
});
