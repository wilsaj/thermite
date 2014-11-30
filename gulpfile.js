'use strict';
var browserify = require('browserify');
var gulp = require('gulp');
var react = require('gulp-react');
var transform = require('vinyl-transform');

var dirs = {
  dist: 'dist/',
  tmp: '.tmp/'
};
var paths = {
  jsx: 'lib/**/*.jsx'
};

gulp.task('default', ['dist']);

gulp.task('browserify', ['react'], function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(dirs.tmp + '/**/*.js')
    .pipe(browserified)
    .pipe(gulp.dest(dirs.dist));
});


gulp.task('dev', ['default', 'watch']);

gulp.task('dist', ['react', 'browserify']);

gulp.task('react', function () {
  return gulp.src(paths.jsx)
    .pipe(react())
    .pipe(gulp.dest(dirs.tmp));
});

gulp.task('watch', function () {
  return gulp.watch(paths.jsx, ['default']);
});
