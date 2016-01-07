//====================================================================================
//==================================== Brandon Napky =================================
//==================================== 28/December/2015 ==============================
//====================================================================================

//====================================================================================
//==================================== Dependencies ==================================
//====================================================================================
"use strict";
let gulp       = require('gulp'),
    livereload = require('gulp-livereload'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    rename     = require('gulp-rename'),
    sass       = require('gulp-ruby-sass'),
    imagemin   = require('gulp-imagemin'),
    server     = require('gulp-develop-server' ),
    jshint     = require('gulp-jshint');

let paths         = {};
paths.src         = {};
paths.build       = {};
paths.entryScript = 'bin/www';
//===================================================================================
//==================================== Asset Paths ==================================
//===================================================================================
let src = './assets/src/';
paths.src.scripts   = src + 'javascripts/';
paths.src.sass      = src + 'sass/';
paths.src.images    = src + 'images/';
paths.src.fonts     = src + 'fonts/';
paths.src.html      = src;

let dist = './assets/';
paths.build.scripts = dist + 'javascripts/';
paths.build.sass    = dist + 'stylesheets/';
paths.build.images  = dist + 'images/';
paths.build.fonts   = dist + 'fonts/';
paths.build.html    = dist;

//===================================================================================
//======================== Concatenate & Minify JS ==================================
//===================================================================================
gulp.task('scripts', () => {
   console.log('Src Scripts : '  + paths.src.scripts);
   console.log('Dist Scripts : ' + paths.build.scripts);

    return gulp.src(paths.src.scripts + '**/*.js')
       .pipe(rename({suffix: '.min'}))
       .pipe(uglify())
       .pipe(gulp.dest(paths.build.scripts))
       .pipe(livereload());
});

//===================================================================================
//======================== Compile SASS to a minified cs ============================
//===================================================================================
gulp.task('sass',() => {
  let opt = { trace: true, style: "compressed" };
  return sass( paths.src.sass + '/style.scss', opt)
    .pipe(gulp.dest(paths.build.sass))
    .pipe(livereload());
});

//===================================================================================
//======================== Optimize img for the web =================================
//===================================================================================
gulp.task('images',() => {
    console.log('Src img : '  + paths.src.images);
    console.log('Dist img : ' + paths.build.images);
    return gulp.src(paths.src.images + '**/*')
    .pipe(gulp.dest(paths.build.images))
    .pipe(livereload());
});

//===================================================================================
//==================== JS logs for  errors and warnings =============================
//===================================================================================
gulp.task('jshint',() => {
	return gulp
		.src([ paths.src.scripts + '*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});
//===================================================================================
//================================= Server ==========================================
//===================================================================================
gulp.task( 'server:start', () => {
    server.listen( { path: paths.entryScript } );
});
gulp.task( 'server:restart',server.restart);
//===================================================================================
//======================== A single task to watch them all ==========================
//===================================================================================
gulp.task('watch',() => {
  livereload.listen();
   // Watch .js files
  gulp.watch(paths.src.scripts + '**/*.js',   ['scripts']);
   // Watch .scss files
  gulp.watch(paths.src.sass    + '**/*.scss', ['sass']);
   // Watch image files
  gulp.watch(paths.src.images  + '**/*',      ['images']);
  // Watch .js files
  gulp.watch(paths.src.scripts + '**/*.js',   ['jshint']);
  //server restart
  gulp.watch( [ './app.js' ],   ['server:restart']);
  gulp.watch( [ './api/*.js' ], ['server:restart']);
 });

//===================================================================================
//======================== Tasks ====================================================
//===================================================================================
gulp.task('default', ['scripts', 'sass', 'images','jshint', 'server:start' ,'watch']);
