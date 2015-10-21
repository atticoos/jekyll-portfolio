var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'),
    path = require('path'),
    paths = {
      source: './src',
      site: './public',
      dist: './public/dist'
    };

gulp.task('less', function () {
  gulp.src(path.join(paths.source, '_assets/less/main.less'))
  .pipe(less())
  .pipe(gulp.dest(paths.dist));
});

gulp.task('jekyll', function (done) {
  var spawn = require('child_process').spawn,
      jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});
  jekyll.on('exit', function (code) {
    done(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
  });
});

gulp.task('html', ['jekyll'], function () {
  gulp.src(path.join(paths.site, '**/*.html'))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(paths.site));
});

gulp.task('build', ['less', 'html']);

gulp.task('watch', ['build'], function () {
  gulp.watch([
    path.join(paths.source, '_includes/**/*.html'),
    path.join(paths.source, '_layouts/**/*.html'),
    path.join(paths.source, 'index.html')
  ], ['html']);
  gulp.watch(path.join(paths.source, '_assets/less/**/*.less'), ['less']);
});
