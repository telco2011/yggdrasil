import { Gulpclass, Task, SequenceTask, gulp, ts, YggdrasilGulpfile } from './gulp.abstract.class';

@Gulpclass()
export class Gulpfile extends YggdrasilGulpfile {

  private tsProject = ts.createProject('tsconfig.json');

  @Task('compile')
  private typescript() {
    return this.tsProject.src()
        .pipe(this.tsProject())
        .js.pipe(gulp.dest('dist'));
  }

}
