'use strict';

const gulp				= require('gulp'),
	  gulpLoadPlugins	= require('gulp-load-plugins');

let $ = gulpLoadPlugins({
	overridePattern: false,
	pattern: [
		'vinyl-buffer',
		'merge-stream',
		'autoprefixer',
		'cssnano',
		'imagemin-mozjpeg',
		'browser-sync'
	],
});

// Copy
gulp.task('copy', function() {
	return gulp.src('src/resources/**/*.*')
		.pipe(gulp.dest('build'));
});

// Sprites PNG
gulp.task('sprites:png', function() {
	let spriteData = gulp.src('src/img/sprites/png/*.png')
		.pipe($.spritesmith({
			cssName: '_sprites.scss',
			imgName: 'sprite.png',
			imgPath: '../img/sprite.png',
			retinaImgName: 'sprite@2x.png',
			retinaImgPath: '../img/sprite@2x.png',
			retinaSrcFilter: 'src/img/sprites/png/*@2x.png',
			padding: 2,
		}));

	let imgStream = spriteData.img
		.pipe($.vinylBuffer())
		.pipe($.imagemin())
		.pipe(gulp.dest('build/img'));

	let cssStream = spriteData.css
		.pipe(gulp.dest('src/scss'));

	return $.mergeStream(imgStream, cssStream);
});

// Sprites SVG
gulp.task('sprites:svg', function() {
	return gulp.src('src/img/sprites/svg/*.svg')
		.pipe($.svgmin({
			js2svg: {
				pretty: true,
			}
		}))
		.pipe($.svgstore())
		.pipe($.rename('sprite.svg'))
		.pipe(gulp.dest('build/img'));
});

// Pug
gulp.task('pug', function() {
	return gulp.src('src/*.pug')
		.pipe($.pug())
		.pipe(gulp.dest('build'))
});

// SCSS
gulp.task('scss', function() {
	let plugins = [
		$.cssnano({
			autoprefixer: {
				add: true,
				browsers: ['> 0%'],
			},
			calc: true,
			discardComments: {
				removeAll: true,
			},
			zindex: false,
		}),
		$.autoprefixer({
			add: true,
			browsers: ['> 0%'],
		})
	];
	return gulp.src('src/scss/*.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass())
		.pipe($.postcss(plugins))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('build/css'))
});

// images
gulp.task('images', function() {
	return gulp.src('src/img/**/*.*')
		.pipe(gulp.dest('build/img'));
});
gulp.task('optimize:images', function() {
	return gulp.src('src/img/**/*.*')
		.pipe($.imagemin([
			$.imagemin.gifsicle({
				interlaced: true,
			}),
			$.imagemin.optipng({
				optimizationLevel: 3,
			}),
			$.imageminMozjpeg({
				progressive: true,
				quality: 80,
			}),
		]))
		.pipe(gulp.dest('src/img'));
});
gulp.task('optimize:svg', function() {
	return gulp.src('src/img/**/*.svg')
		.pipe($.svgmin())
		.pipe(gulp.dest('src/img'));
});

// Concat
gulp.task('libs', function() {
	return gulp.src(['node_modules/jquery/dist/jquery.min.js',
					 'node_modules/svg4everybody/dist/svg4everybody.js'])
		.pipe($.concat('libs.min.js'))
		.pipe(gulp.dest('build/js'))
});

// Scripts
gulp.task('scripts', function() {
	return gulp.src(['src/js/main.js'])
		// .pipe($.uglify())
		.pipe(gulp.dest('build/js'))
});

// Watch
gulp.task('watch', function() {
	gulp.watch('src/resources/**/*.*', gulp.series('copy'));
	gulp.watch('src/img/sprites/png/*.png', gulp.series('sprites:png'));
	gulp.watch('src/img/sprites/svg/*.svg', gulp.series('sprites:svg'));
	gulp.watch('src/img/**/*.*', gulp.series('images'));
	gulp.watch('src/**/*.pug', gulp.series('pug'));
	gulp.watch('src/scss/**/*.scss', gulp.series('scss'));
	gulp.watch('src/js/main.js', gulp.series('scripts'));
});

// Browser Sync
gulp.task('serve', function() {
    $.browserSync
		.create()
		.init({
			files: [
				'./build/**/*',
			],
        	proxy: 'js-mission/build'
    	});
});

// ZIP
gulp.task('zip', () => {
	let name = require('./package').name;
	let now = new Date();
	let year = now.getFullYear().toString().padStart(2, '0');
	let month = (now.getMonth() + 1).toString().padStart(2, '0');
	let day = now.getDate().toString().padStart(2, '0');
	let hours = now.getHours().toString().padStart(2, '0');
	let minutes = now.getMinutes().toString().padStart(2, '0');

	return gulp.src([
		'build/**',
		'src/**',
		'.gitignore',
		'yarn.lock',
		'*.js',
		'*.json',
		'*.md',
		'*.yml',
		'!package-lock.json',
		'!zip/**',
	], {
		base: '.',
		dot: true,
	})
		.pipe($.zip(`${name}_${year}-${month}-${day}_${hours}-${minutes}.zip`))
		.pipe(gulp.dest('zip'));
});

// Build
gulp.task('build', gulp.series(
	gulp.parallel(
		'copy',
		'pug',
		'scss',
		'images',
		// 'libs',
		'scripts'
	)
));

// Default
gulp.task('default', gulp.series(
	'build',
	gulp.parallel(
		'watch',
		'serve'
	)
));
