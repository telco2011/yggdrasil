import { Gulpclass, Task, SequenceTask } from 'gulpclass/Decorators';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as gulpTslint from 'gulp-tslint';
import * as sass from 'gulp-sass';
import * as nodemon from 'gulp-nodemon';

import * as del from 'del';

import { YggdrasilGulpfile } from './gulp.abstract.class';

@Gulpclass()
export class Gulpfile extends YggdrasilGulpfile{

  private tsProject = ts.createProject('tsconfig.json');

  @Task('compile')
  private typescript() {
    return this.tsProject.src()
        .pipe(this.tsProject())
        .js.pipe(gulp.dest('dist'));
  }

}
