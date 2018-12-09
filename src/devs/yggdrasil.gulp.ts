import { Gulpclass, Task, SequenceTask } from 'gulpclass';
import * as gulp from 'gulp';
import { SrcOptions } from 'vinyl-fs';
import * as ts from 'gulp-typescript';
import gulpTslint from 'gulp-tslint';
import * as sass from 'gulp-sass';
import * as nodemon from 'gulp-nodemon';

import * as del from 'del';
import * as fs from 'fs';
import { compile } from 'handlebars';

@Gulpclass()
export class YggdrasilGulpfile {

	private tsProject = ts.createProject('tsconfig.json');
	private tsTestProject = ts.createProject('tsconfig.spec.json');

	@SequenceTask('start')
	public start() {
		return ['build', 'watch'];
	}

	@Task('default')
	public defaultTask() {
		return ['build'];
	}

	@SequenceTask('build')
	public build() {
		return ['clean', 'copyAssets', 'tslint', 'compile'];
	}

	@SequenceTask('build:test')
	public buildTest() {
		return ['clean', 'copyAssets', 'tslint:test', 'compile:test'];
	}

	@SequenceTask('copyAssets')
	public copyAssets() {
		return ['copySass', 'copyJs', 'copyViews', 'copyStatics'];
	}

	@Task('watch')
	public watch() {
		gulp.watch(['src/**/*.ts'], gulp.parallel(this.tsLint, this.typescript, this.nodemon));
		gulp.watch(['src/public/js/**/*.js'], gulp.parallel(this.copyJs));
		gulp.watch(['src/public/scss/**/*.scss'], gulp.parallel(this.copySass));
		gulp.watch([
			'src/public/css/**/*',
			'src/public/{images,img}/**/*',
			'src/public/{font,fonts}/**/*'
		], gulp.parallel(this.copyStatics));
		gulp.watch(['src/views/**/*.pug', 'src/views/**/*.hbs'], gulp.parallel(this.copyViews));
		this.nodemon();
	}

	@Task('nodemon')
	public nodemon() {
		return nodemon({
			script: 'dist/ignition.js'
		});
	}

	@Task('clean:all')
	public cleanAll() {
		this._clean();
		return del([
			'./node_modules',
			'./.nyc_output',
			'./coverage',
			'./package-lock.json',
			'./yarn.lock'
		]);
	}

	@Task('clean')
	public clean() {
		return this._clean();
	}

	/**
	 * GULP STATIC TASKS - START
	 */
	@Task('copyStatics')
	public copyStatics() {
		return this._executeGulpSrc([
			'src/public/**/*',
			'!src/public/{js,js/**}',
			'!src/public/{scss,scss/**}'
		]).pipe(gulp.dest('dist/public'));
	}

	@Task('copyViews')
	public copyViews() {
		return this._executeGulpSrc([
			'src/views/**/*'
		]).pipe(gulp.dest('dist/views'));
	}

	@Task('copyJs')
	public copyJs() {
		// TODO: Be careful if these folders doesn't exist
		const yggdrasilThirdPartyJS = [
			'node_modules/bootstrap/dist/js/bootstrap.min.js',
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/tether/dist/js/tether.min.js'
		];

		return this._executeGulpSrc([
			// Third-party js
			...yggdrasilThirdPartyJS,

			// App js
			'src/public/js/**/*'
		]).pipe(gulp.dest('dist/public/js'));
	}

	@Task('copySass')
	public copySass() {
		// TODO: Be careful if these folders doesn't exist
		const yggdrasilThirdPartySCSS = [
			'node_modules/bootstrap/scss/bootstrap.scss'
		];

		return this._executeGulpSrc([
			// Third-party styles
			...yggdrasilThirdPartySCSS,

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

	/** Internal functions */

	/**
	 * Clean directories
	 */
	private _clean() {
		return del([
			'./dist',
			'./logs'
		]);
	}

	private _executeGulpSrc(globs: string|string[]): NodeJS.ReadWriteStream {
		const gulpOptions: SrcOptions = { allowEmpty: true };

		return gulp.src(globs, gulpOptions);
	}
}
