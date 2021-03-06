'use strict';

var babel = require('gulp-babel');
var browserify = require('browserify');
var del = require('del');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var transform = require('vinyl-transform');
var vinylPaths = require('vinyl-paths');
var webserver = require('gulp-webserver');


var dirs = {
  dist: 'dist/',
  sassCache: '.sass-cache',
  tmp: '.tmp/',
};

var paths = {
  jsx: 'lib/**/*.jsx',
  scss: 'lib/**/*.scss',
};

gulp.task('default', ['dist']);

gulp.task('browserify', ['jsx'], function () {
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

gulp.task('dist', ['jsx', 'browserify', 'scss']);

gulp.task('jsx', function () {
  return gulp.src(paths.jsx)
    .pipe(babel())
    .pipe(gulp.dest(dirs.tmp));
});

gulp.task('scss', function () {
  return gulp.src(paths.scss)
    .pipe(sass())
    .pipe(gulp.dest(dirs.dist));
});

gulp.task('lint', function () {
  return gulp.src([paths.jsx])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
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
