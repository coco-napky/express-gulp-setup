//====================================================================================
//==================================== Brandon Napky =================================
//==================================== 28/December/2015 ==============================
//====================================================================================

//====================================================================================
//==================================== Dependencies ==================================
//====================================================================================
"use strict";
const gulp       = require('gulp'),
      livereload = require('gulp-livereload'),
      concat     = require('gulp-concat'),
      uglify     = require('gulp-uglify'),
      rename     = require('gulp-rename'),
      sass       = require('gulp-ruby-sass'),
      imagemin   = require('gulp-imagemin'),
      server     = require('gulp-develop-server' ),
      browserify = require('browserify'),
      streamify  = require('gulp-streamify'),
      source     = require('vinyl-source-stream'),
      babel      = require('gulp-babel'),
      jshint     = require('gulp-jshint');

const paths         = {};
paths.src         = {};
paths.build       = {};
paths.entryScript = 'bin/www';
//===================================================================================
//==================================== Asset Paths ==================================
//===================================================================================
const src = './assets/src/';
paths.src.scripts   = src + 'javascripts/';
paths.src.sass      = src + 'sass/';
paths.src.images    = src + 'images/';
paths.src.fonts     = src + 'fonts/';
paths.src.html      = src;

const dist = './assets/';
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


   return browserify({
          debug: true,
          entries: [ paths.src.scripts + '/app.js' ]
        })
        .transform("babelify", {presets: ["es2015", "react"]})
        .bundle()
        .pipe( source('app.js') )
        .pipe(streamify(uglify()))
        .pipe(streamify(rename({suffix: ".min"})))
        .pipe(gulp.dest(paths.build.scripts));
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
		.pipe(jshint({"esnext": true, "plusplus": true,
                  "devel": true, "globalstrict": true}))
		.pipe(jshint.reporter('default'));6
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
  gulp.watch( [ './api/**/*.js' ], ['server:restart']);
 });

//===================================================================================
//======================== Tasks ====================================================
//===================================================================================
gulp.task('default', ['scripts', 'sass', 'images','jshint', 'server:start' ,'watch']);
