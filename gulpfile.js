'use strict';
var browserify = require('browserify');
var del = require('del');
var gulp = require('gulp');
var react = require('gulp-react');
var sass = require('gulp-ruby-sass');
var transform = require('vinyl-transform');
var vinylPaths = require('vinyl-paths');
var webserver = require('gulp-webserver');

var dirs = {
  dist: 'dist/',
  sassCache: '.sass-cache',
  tmp: '.tmp/'
};

var paths = {
  jsx: 'lib/**/*.jsx',
  scss: 'lib/**/*.scss'
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

gulp.task('clean', ['clean-dist', 'clean-tmp', 'clean-sass-cache']);

gulp.task('clean-dist', function() {
  return gulp.src(dirs.dist)
    .pipe(vinylPaths(del));
});

gulp.task('clean-sass-cache', function() {
  return gulp.src(dirs.sassCache)
    .pipe(vinylPaths(del));
});

gulp.task('clean-tmp', function() {
  return gulp.src(dirs.tmp)
    .pipe(vinylPaths(del));
});

gulp.task('dev', ['default', 'watch', 'webserver']);

gulp.task('dist', ['react', 'browserify', 'scss']);

gulp.task('react', function () {
  return gulp.src(paths.jsx)
    .pipe(react())
    .pipe(gulp.dest(dirs.tmp));
});

gulp.task('scss', function () {
  return gulp.src(paths.scss)
    .pipe(sass())
    .pipe(gulp.dest(dirs.dist));
});

gulp.task('watch', function () {
  gulp.watch(paths.jsx, ['browserify']);
  gulp.watch(paths.scss, ['scss']);
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      open: 'example/slides.html'
    }));
});
