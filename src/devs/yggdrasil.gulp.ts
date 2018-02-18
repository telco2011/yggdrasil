import { Gulpclass, Task, SequenceTask } from 'gulpclass/Decorators';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import gulpTslint from 'gulp-tslint';
import { TslintPlugin } from 'gulp-tslint';
import * as sass from 'gulp-sass';
import * as nodemon from 'gulp-nodemon';

import * as tslint from 'tslint';
import * as del from 'del';
import * as fs from 'fs';

@Gulpclass()
export class YggdrasilGulpfile {

	private tsProject = ts.createProject('tsconfig.json');
	private tsTestProject = ts.createProject('tsconfig.spec.json');

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
		return ['clean', 'copyAssets', 'tslint', 'compile'];
	}

	@SequenceTask('build:test')
	public buildTest() {
		return ['clean', 'copyAssets', 'tslint:test', 'compile:test'];
	}

	@SequenceTask()
	public copyAssets() {
		return ['copySass', 'copyJs', 'copyViews', 'copyStatics'];
	}

	@Task('watch')
	public watch() {
		gulp.watch(['src/**/*.ts'], ['tslint', 'compile', 'nodemon']);
		gulp.watch(['src/public/js/**/*.js'], ['copyJs']);
		gulp.watch(['src/public/scss/**/*.scss'], ['copySass']);
		gulp.watch(['src/views/**/*.pug', 'src/views/**/*.hbs'], ['copyViews']);
	}

	@Task()
	public nodemon() {
		return nodemon({
			script: 'dist/ignition.js'
		});
	}

	@Task('clean:all', ['clean'])
	public cleanAll() {
		return del([
			'./node_modules',
			'./.nyc_output',
			'./coverage',
			'./package-lock.json',
			'./yarn.lock'
		]);
	}

	@Task()
	public clean() {
		return del([
			'./dist',
			'./logs'
		]);
	}

	/**
	 * GULP STATIC TASKS - START
	 */
	@Task()
	public copyStatics() {
		return gulp.src([
			'src/public/**/*',
			'!src/public/scss/**/*'
		]).pipe(gulp.dest('dist/public'));
	}

	@Task()
	public copyViews() {
		return gulp.src([
			'src/views/**/*'
		]).pipe(gulp.dest('dist/views'));
	}

	@Task()
	public copyJs() {
		const yggdrasilThirdPartyJS = [
			'node_modules/bootstrap/dist/js/bootstrap.min.js',
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/tether/dist/js/tether.min.js'
		];

		return gulp.src([
			// Third-party js
			yggdrasilThirdPartyJS,

			// App js
			'src/public/js/**/*'
		]).pipe(gulp.dest('dist/public/js'));
	}

	@Task()
	public copySass() {
		const yggdrasilThirdPartySCSS = [
			'node_modules/bootstrap/scss/bootstrap.scss'
		];

		return gulp.src([
				// Third-party styles
				yggdrasilThirdPartySCSS,

				// App styles
				'src/public/scss/*.scss'
			]).pipe(sass())
			.pipe(gulp.dest('dist/public/css'));
	}
	/**
	 * GULP STATIC TASKS - END
	 */

	// TODO: Test this method
	@Task('addYggdrasilScriptsToPkg')
	public addYggdrasilScriptsToPkg() {
		const parentPkg = require('./node_modules/@yggdrasilts/devs/parent-pkg/parent-pkg.json');
		const projectPkg = require('./package.json');

		fs.writeFileSync('./package.json.bkp', JSON.stringify(projectPkg, null, 2));

		Object.assign(projectPkg.scripts, parentPkg.scripts);
		Object.assign(projectPkg.nyc, parentPkg.nyc);

		fs.writeFileSync('./package.json', JSON.stringify(projectPkg, null, 2));
	}

	/** Non Testing Zone */
	@Task('tslint')
	private tsLint() {
		return gulp.src(['src/**/*.ts', '!src/**/*.spec.ts'])
			.pipe(gulpTslint({ configuration: 'tslint.json' }))
			.pipe(gulpTslint.report());
	}

	@Task('compile')
	private typescript() {
		return this.tsProject.src()
			.pipe(this.tsProject())
			.js.pipe(gulp.dest('dist'));
	}

	/** Testing Zone */
	@Task('tslint:test')
	private tsLintTest() {
		return gulp.src(['src/**/*.ts'])
			.pipe(gulpTslint({ configuration: 'tslint.json' }))
			.pipe(gulpTslint.report());
	}

	@Task('compile:test')
	private typescriptTest() {
		return this.tsTestProject.src()
			.pipe(this.tsTestProject())
			.js.pipe(gulp.dest('dist'));
	}

}
