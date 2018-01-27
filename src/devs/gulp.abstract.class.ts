import { Gulpclass, Task, SequenceTask } from 'gulpclass/Decorators';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as gulpTslint from 'gulp-tslint';
import * as sass from 'gulp-sass';
import * as nodemon from 'gulp-nodemon';

import * as del from 'del';

@Gulpclass()
export abstract class YggdrasilGulpfile {

  @SequenceTask()
  protected start() {
    return ['build', ['watch', 'nodemon']];
  }

  @Task('default', ['build'])
  protected defaultTask() {
    // Default task. Not code is needed.
  }

  @SequenceTask()
  protected build() {
      return ['clean', 'copyAssets', 'compile'];
  }

  @SequenceTask()
  protected copyAssets() {
    return ['copySass', 'copyJs', 'copyViews', 'copyStatics'];
  }

  @Task('watch')
  protected watch() {
    gulp.watch(['src/**/*.ts'], ['compile']);
    gulp.watch(['src/public/js/**/*.js'], ['copyJs']);
    gulp.watch(['src/public/scss/**/*.scss'], ['copySass']);
    gulp.watch(['src/views/**/*.pug', 'src/views/**/*.hbs'], ['copyViews']);
  }

  @Task()
  protected nodemon() {
    return nodemon({
        script: 'dist/ignition.js',
        tasks: ['watch']
      });
  }

  @Task('clean:all', ['clean'])
  protected cleanAll() {
    return del([
      './node_modules'
    ]);
  }

  @Task()
  protected clean() {
    return del([
      './dist',
      './logs'
    ]);
  }

  @Task()
  protected copyStatics() {
    return gulp.src([
        'src/public/images/**/*'
      ]).pipe(gulp.dest('dist/public/images'));
  }

  @Task()
  protected copyViews() {
    return gulp.src([
        'src/views/**/*'
      ]).pipe(gulp.dest('dist/views'));
  }

  @Task()
  protected copyJs() {
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
  protected copySass() {
    return gulp.src([
        // Third-party styles
        'node_modules/bootstrap/scss/bootstrap.scss',

        // App styles
        'src/public/scss/*.scss']
      ).pipe(sass())
        .pipe(gulp.dest('dist/public/css'));
  }

}
