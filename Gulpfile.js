var gulp = require('gulp'),
    util = require('gulp-util'),
    less = require('gulp-less'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    path = require('path'),
    paths = {
      source: './src',
      site: './public',
      dist: './public/dist'
    };

gulp.task('less', function () {
  return gulp.src(path.join(paths.source, '_assets/less/main.less'))
  .pipe(less())
  .pipe(autoprefixer({
    browsers: '> 5%'
  }))
  .pipe(gulpif(util.env.production, minifycss({compatability: 'ie8'})))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('js:site', function () {
  return gulp.src(path.join(paths.source, '_assets/scripts/**/*.js'))
  .pipe(concat('site.js'))
  .pipe(gulpif(util.env.production, uglify()))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('js:vendor', function () {
  return gulp.src([
    'bower_components/lodash/lodash.js',
    'bower_components/jquery/dist/jquery.js',
    'bower_components/raven-js/dist/raven.js',
    'bower_components/fluid-labels/dist/fluid-labels.js',
    'bower_components/inview/jquery.inview.js',
    'bower_components/masonry/dist/masonry.pkgd.js',
    'bower_components/waypoints/lib/jquery.waypoints.js',
		'bower_components/jquery.lazyload/jquery.lazyload.js',
    'bower_components/owl.carousel/dist/owl.carousel.js',
    'bower_components/instantclick/instantclick.js',
    'bower_components/Chart.js/Chart.js'
 ])
  .pipe(concat('vendor.js'))
  .pipe(gulpif(util.env.production, uglify()))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('jekyll:serve', function (done) {
  var spawn = require('child_process').spawn,
      jekyll = spawn('jekyll', ['s'], {stdio: 'inherit'});

  jekyll.on('exit', function (code) {
    done(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
  });
});

gulp.task('jekyll', function (done) {
  var spawn = require('child_process').spawn,
      jekyll,
      buildArgs = ['build'];

  if (!util.env.production && !util.env.circle) {
    buildArgs.push('--config');
    buildArgs.push('_config.yml,_config.env.yml');
  }

  jekyll = spawn('jekyll', buildArgs, {stdio: 'inherit'});
  jekyll.on('exit', function (code) {
    done(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
  });
});

gulp.task('html', function () {
  return gulp.src(path.join(paths.site, '**/*.html'))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(paths.site));
});

gulp.task('images', function () {
  return gulp.src(path.join(paths.source, '_assets/images/**/*'))
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest(path.join(paths.dist, 'images')));
});

gulp.task('images:copy', function () {
  return gulp.src(path.join(paths.source, '_assets/images/**/*'))
  .pipe(gulp.dest(path.join(paths.dist, 'images')));
})

gulp.task('fonts', function () {
  return gulp.src([
    './bower_components/font-awesome/fonts/**/*',
    './bower_components/octicons/octicons/octicons.{eot,svg,ttf,woff}'
  ])
  .pipe(gulp.dest(path.join(paths.dist, 'fonts')));
});

gulp.task('js', ['js:vendor', 'js:site']);
gulp.task('build', ['fonts', 'less', 'js', 'images', 'html', 'jekyll']);
gulp.task('dev', ['fonts', 'less', 'js', 'images:copy', 'html', 'jekyll']);
gulp.task('circle', ['fonts', 'less', 'js', 'images:copy', 'html']);

gulp.task('watch', ['dev'], function () {
  var spawn = require('child_process').spawn,
      jekyll;
  gulp.watch(path.join(paths.source, '_assets/scripts/**/*.js'), ['js:site']);
  gulp.watch(path.join(paths.source, '_assets/less/**/*.less'), ['less']);
  gulp.watch(path.join(paths.source, '_assets/images/**/*'), ['images:copy']);
  // jekyll = spawn('jekyll', ['s'], {stdio: 'inherit'});
});
