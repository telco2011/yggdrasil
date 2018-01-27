import { Gulpclass, Task, SequenceTask, gulp, ts, YggdrasilGulpfile } from './gulp.abstract.class';

@Gulpclass()
export class GulpTestfile extends YggdrasilGulpfile {

  private tsProject = ts.createProject('tsconfig.spec.json');

  @Task('compile:test')
  private typescript() {
    return this.tsProject.src()
        .pipe(this.tsProject())
        .js.pipe(gulp.dest('dist'));
  }

}
