var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    paths = {
      dist: './dist'
    };

gulp.task('less', function () {
  gulp.src('_assets/less/main.less')
  .pipe(less())
  .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['less']);
