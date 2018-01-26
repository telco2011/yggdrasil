import { Gulpclass, Task, SequenceTask } from 'gulpclass/Decorators';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as gulpTslint from 'gulp-tslint';
import * as sass from 'gulp-sass';
import * as nodemon from 'gulp-nodemon';

import * as del from 'del';

@Gulpclass()
export class Gulpfile {

  private tsProject = ts.createProject('tsconfig.json');

  @SequenceTask()
  public start() {
    return ['build', ['watch', 'nodemon']];
  }

  @Task('default', ['build'])
  public defaultTask() {
    // Default task. Not code is needed.
  }

  @SequenceTask()
  public build() {
      return ['clean', 'copyAssets', 'compile'];
  }

  @SequenceTask()
  public copyAssets() {
    return ['copySass', 'copyJs', 'copyViews', 'copyStatics'];
  }

  @Task('watch')
  public watch() {
    gulp.watch(['src/**/*.ts'], ['compile']);
    gulp.watch(['src/public/js/**/*.js'], ['copyJs']);
    gulp.watch(['src/public/scss/**/*.scss'], ['copySass']);
    gulp.watch(['src/views/**/*.pug', 'src/views/**/*.hbs'], ['copyViews']);
  }

  @Task()
  private nodemon() {
    return nodemon({
        script: 'dist/ignition.js',
        tasks: ['watch']
      });
  }

  @Task('clean:all', ['clean'])
  private cleanAll() {
    return del([
      './node_modules'
    ]);
  }

  @Task()
  private clean() {
    return del([
      './dist',
      './logs'
    ]);
  }

  @Task('compile')
  private typescript() {
    return this.tsProject.src()
        .pipe(this.tsProject())
        .js.pipe(gulp.dest('dist'));
  }

  @Task()
  private copyStatics() {
    return gulp.src([
        'src/public/images/**/*'
      ]).pipe(gulp.dest('dist/public/images'));
  }

  @Task()
  private copyViews() {
    return gulp.src([
        'src/views/**/*'
      ]).pipe(gulp.dest('dist/views'));
  }

  @Task()
  private copyJs() {
    return gulp.src([
        // Third-party js
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/tether/dist/js/tether.min.js',

        // App js
        'src/public/js/main.js'
      ]).pipe(gulp.dest('dist/public/js'));
  }

  @Task()
  private copySass() {
    return gulp.src([
        // Third-party styles
        'node_modules/bootstrap/scss/bootstrap.scss',

        // App styles
        'src/public/scss/*.scss']
      ).pipe(sass())
        .pipe(gulp.dest('dist/public/css'));
  }
}
