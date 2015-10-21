var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'),
    path = require('path'),
    paths = {
      site: './_site',
      dist: './dist'
    };

gulp.task('less', function () {
  gulp.src('_assets/less/main.less')
  .pipe(less())
  .pipe(gulp.dest('dist/'));
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
