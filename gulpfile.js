var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	browSync = require('browser-sync'),
	imagemin = require('gulp-imagemin'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	rigger = require('gulp-rigger'),
	htmlmin = require('gulp-html-minifier'),
	jsmin = require('gulp-jsmin');

gulp.task('build', function () {
	gulp.src('app/js/*.js')
		.pipe(jsmin())
		.pipe(gulp.dest('dist/js'));

	gulp.src('./app/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./dist'));

	gulp.src('app/css/global.css')
		.pipe(cssmin())
		.pipe(gulp.dest('dist/css'));

	gulp.src('app/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));

	gulp.src('app/fonts/*')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('html', function () {
	gulp.src('app/*.html')
		.pipe(rigger())
		.pipe(gulp.dest('dist/'));
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('app/css'))
	.pipe(browSync.reload({stream: true}))
});

gulp.task('concat', function() {
	return gulp.src('app/jsOther/**/*.js')
	.pipe(concat('global.js'))
	.pipe(gulp.dest('app/js'))
	.pipe(browSync.reload({stream: true}))
});

gulp.task('sync', function() {
	browSync({
		server:{
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('watch', ['sync', 'sass'] , function() {
	gulp.watch('app/sass/**/*.scss' , ['sass']);
	gulp.watch('app/jsOther/**/*.js' , ['concat']);
	gulp.watch('app/*.html', browSync.reload);	
});