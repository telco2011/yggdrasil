var gulp = require('gulp');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var tsProject = ts.createProject('tsconfig.json');

// Compile ts
gulp.task('typescript', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src([
    // Third-party styles
    'node_modules/bootstrap/scss/bootstrap.scss',

    // App styles
    'src/public/scss/*.scss']
  ).pipe(sass())
    .pipe(gulp.dest("dist/public/css"));
});

// Move the javascript files into our /src/js folder
gulp.task('js', function() {
  return gulp.src([
    // Third-party js
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/tether/dist/js/tether.min.js',

    // App js
    'src/public/js/main.js'
  ]).pipe(gulp.dest('dist/public/js'));
});

// Move views
gulp.task('views', function() {
  return gulp.src([
    'src/views/**/*'
  ]).pipe(gulp.dest("dist/views"));
});

// Move images
gulp.task('images', function() {
  return gulp.src([
    'src/public/images/**/*'
  ]).pipe(gulp.dest("dist/public/images"));
});

// Watch
gulp.task('watch', ['typescript', 'js', 'sass', 'images', 'views'], function() {

  gulp.watch(['src/**/*.ts'], ['typescript']);
  gulp.watch(['src/public/js/**/*.js'], ['js']);
  gulp.watch(['src/public/scss/**/*.scss'], ['sass']);
  gulp.watch(['src/views/**/*.pug'], ['views']);

});

gulp.task('default', ['typescript', 'js', 'sass', 'images', 'views']);