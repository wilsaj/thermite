'use strict';
var gulp = require('gulp');
var react = require('gulp-react');

var paths = {
  jsx: 'lib/**/*.jsx'
};

gulp.task('default', ['dist']);

gulp.task('dist', function () {
  return gulp.src(paths.jsx)
    .pipe(react())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  return gulp.watch(paths.jsx, ['default']);
});
