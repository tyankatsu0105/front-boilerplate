'use strict';

// 各種設定ファイル
const config = require('./config.json');

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const cache = require('gulp-cached');
const progeny = require('gulp-progeny');

// ローカルphp開発環境
const connectPhp = require('gulp-connect-php');

// sass
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

// postcss
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

// img min
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');

// stylelint
const stylelint = require('gulp-stylelint');

// eslint
const eslint = require('gulp-eslint');

// prettier
const prettierPlugin = require('gulp-prettier-plugin');

// // --------------------------------------------
// // stylelint
// // --------------------------------------------
gulp.task('stylelint', () => {
	return gulp.src(config.scss, {
			since: gulp.lastRun('stylelint')
		})
		.pipe(plumber({
			// errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(stylelint({
			fix: true
		}))
		.pipe(gulp.dest(file => file.base));
});


// // --------------------------------------------
// // prettier scss
// // --------------------------------------------
gulp.task("prettier:scss", () => {
	return gulp.src(config.prettier.scss, {
			since: gulp.lastRun('prettier:scss')
		})
		.pipe(prettierPlugin({
			// 1行に記述できる文字量　超えると改行する　但し、改行するとエラーになる場合は改行しない
			printWidth: 80,
			// タブの際のインデント数
			tabWidth: 2,
			// ダブルクォーテーションをシングルクォーテーションに変更 ""->''
			singleQuote: true,
			// 配列やオブジェクトなどに使うブラケット（意：カッコ）のスペースを有効にする　有効にするとブラケットにスペースが付く
			bracketSpacing: true
		}, {
			filter: false
		}))
		.pipe(gulp.dest(file => file.base))
});

// --------------------------------------------
// eslint
// --------------------------------------------
gulp.task('eslint', () => {
	return gulp.src(`${config.js}/**/*.js`, {
			since: gulp.lastRun('eslint')
		})
		.pipe(eslint({
			fix: true
		}))
		.pipe(gulp.dest(file => file.base));
});

// --------------------------------------------
// sass
// --------------------------------------------
gulp.task('sass', () => {
	return gulp.src(config.scss)
		.pipe(cache('sass'))
		.pipe(progeny())
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(sourcemaps.init({
			largeFile: true
		}))
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(postcss([
			autoprefixer({
				browsers: ["last 2 versions", "ie >= 11", "Android >= 4", "ios_saf >= 8"],
				cascade: false,
				grid: true
			})
		]))
		.pipe(sourcemaps.write('./scss-sourcemaps'))
		.pipe(gulp.dest(config.cssDest))
});

// --------------------------------------------
// browser-sync
// --------------------------------------------
gulp.task('browser-sync', () => {
	if (config.port) {
		if (config.connectPhp) {
			// connect-php使用
			connectPhp.server({
				port: config.port,
				base: './',
				bin: '/Applications/MAMP/bin/php/php5.6.31/bin/php',
				ini: '/Applications/MAMP/bin/php/php5.6.31/conf/php.ini'
			}, () => {
				browserSync.init({
					proxy: `localhost:${config.port}`,
					open: 'external',
					notify: false
				});
			});
		} else {
			// docker mamp xampなど
			browserSync.init({
				proxy: `localhost:${config.port}`,
				open: 'external',
				notify: false
			});
		}
	} else {
		// 静的開発環境
		browserSync.init({
			server: './',
			open: 'external',
			notify: false
		});
	}
});

// --------------------------------------------
// img min
// --------------------------------------------
gulp.task('img-min', () => {
	return gulp.src(config.img)
		.pipe(changed(config.imgDest))
		.pipe(imagemin([
			pngquant({
				quality: '65-80', // 画質
				speed: 1, // 最低のスピード
				floyd: 0, // ディザリングなし
			}),
			mozjpeg({
				quality: 85, // 画質
				progressive: true
			}),
			imagemin.svgo(),
			imagemin.optipng(),
			imagemin.gifsicle()
		])).pipe(gulp.dest(config.imgDest))
});


// --------------------------------------------
// Watch
// --------------------------------------------
gulp.task('watch', (done) => {
	gulp.watch([config.watch, `${config.cssDest}*.css`, `${config.jsDest}*.js`]).on('change', browserSync.reload);
	gulp.watch(config.scss, gulp.series('stylelint', 'prettier:scss', 'sass'));
	gulp.watch(`${config.js}/**/*.js`, gulp.series('eslint'));
	gulp.watch(config.img, gulp.series('img-min'));
	done();
});

// --------------------------------------------
// command
// --------------------------------------------
gulp.task('default',
	gulp.parallel('browser-sync', 'watch')
);

// 製品化
// --------------------------------------------
gulp.task('product',
	gulp.series(
		'stylelint',
		'prettier:scss',
		'sass',
		'eslint',
		'img-min'
	)
);
