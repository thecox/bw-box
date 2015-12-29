(function() {
  'use strict'

  /**
  * Gulp Dependencies
  */
  var gulp = require('gulp');
  var concat = require('gulp-concat');
  var uglify = require('gulp-uglify');
  var sass = require('gulp-sass');
  var postcss = require('gulp-postcss');
  var autoprefixer = require('autoprefixer');
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');
  var webserver = require('gulp-webserver');
  var livereload = require('gulp-livereload');


  /**
  * Paths
  */
  var src = 'src';
  var dist = 'dist';
  var paths = {
    js: src + '/js/*.js',
    scss: src + '/scss/**/*.scss'
  }

  /**
  * Start a webserver @ localhost:8000
  */
  gulp.task('server', function() {
    return gulp.src(dist + '/')
      .pipe(webserver({
        livereload: true
      }));
  });

  /**
  * Styles compile, prefix, and compress
  */
  gulp.task('compile-sass', function() {
    var processors = [
      autoprefixer({browsers: ['> 1%', 'Last 2 versions', 'IE 8']})
    ];
    return gulp.src(paths.scss)
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(postcss(processors))
      .pipe(concat('jquery.bw-box.min.css'))
      .pipe(gulp.dest(dist + '/css'));
  });

  /**
  * Scripts linting
  */
  gulp.task('lint-js', function() {
    return gulp.src(paths.js)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter('fail'))
  });

  /**
  * Scripts concat and compress
  */
  gulp.task('compress-js', function() {
    return gulp.src(paths.js)
      .pipe(concat('jquery.bw-box.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(dist + '/js'));
  });

  // Watch files and reload browser, as needed
  gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.js, ['compress-js']);
    gulp.watch(paths.scss, ['compile-sass']);
    gulp.watch(dist + '/**').on('change', livereload.changed);
  });

  /**
  * Command line tasks
  */
  gulp.task('default', ['lint-js', 'compress-js', 'compile-sass']);
  gulp.task('scripts', ['lint-js', 'compress-js']);
  gulp.task('styles', ['compile-sass']);
  gulp.task('develop', ['lint-js', 'compress-js', 'compile-sass', 'server', 'watch']);


})();
