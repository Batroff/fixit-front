// Modules =============================================================================================================
const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpif = require('gulp-if');
const smartgrid = require('smart-grid');
const webpackStream = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const browserSync = require('browser-sync').create();
// =====================================================================================================================

// Args ================================================================================================================
const {argv} = require('yargs');

const isDev = argv.mode === 'dev';
const isSync = argv.sync === 'true';
// =====================================================================================================================

// Path ================================================================================================================
const srcDir = ('src')
const buildDir = ('app');

const projPath = {
  build: {
    html: buildDir,
    css: buildDir + '/css',
    js: buildDir + '/js',
    sprites: buildDir + '/images',
    modules: buildDir + '/local_modules',
    fonts: buildDir + '/fonts'
  },
  src: {
    html: srcDir + '/[^_]*.html',
    css: srcDir + '/css/*.{scss,sass}',
    js: srcDir + [
      '/js/index.js'
    ],
    sprites: srcDir + '/images/**/*.{png,jpg,gif,webp,svg}',
    modules: srcDir + '/local_modules/',
    fonts: srcDir + '/fonts/'
  },
  watch: {
    html: srcDir + '/(blocks|*)/*.html',
    css: srcDir + '/css/**/*.{sass,scss}',
    js: srcDir + '/js/**/*.{js,json}',
    sprites: srcDir + '/images/**/*.{png,jpg,gif,webp,svg}'
  }
}
// =====================================================================================================================

// Build tasks =========================================================================================================
gulp.task('css:build', function() {
  return gulp.src(projPath.src.css)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass()
      .on('error', sass.logError))
    .pipe(gcmq())
    .pipe(autoprefixer({
        cascade: false
      }))
    .pipe(gulpif(!isDev, cleanCSS({
        level: 2
      })))
    // .pipe(gzip())
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(projPath.build.css))
    .pipe(gulpif(isSync, browserSync.stream()));
})

gulp.task('js:build', function() {
  return gulp.src(projPath.src.js)
    .pipe(webpackStream(require('./webpack.config.js')))
    .pipe(gulp.dest(projPath.build.js))
    .pipe(gulpif(isSync, browserSync.stream()));
});

gulp.task('html:build', function() {
  return gulp.src(projPath.src.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest(projPath.build.html))
    .pipe(gulpif(isSync, browserSync.stream()));
});

// TODO: add webp/jpeg-2000 converter
gulp.task('sprites:build', function() {
  return gulp.src(projPath.src.sprites)
    .pipe(gulpif(!isDev, imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({ plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]})
    ])))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest(projPath.build.sprites))
    .pipe(gulpif(isSync, browserSync.stream()));
});

gulp.task('modules:build', function() {
  return gulp.src(projPath.src.modules)
    .pipe(gulp.dest(projPath.build.modules));
});

gulp.task('other:build', function() {
  return gulp.src(`${srcDir}/*.{xml,webmanifest,ico}`)
    .pipe(gulp.dest(`${buildDir}/`));
});

gulp.task('fonts:build', function() {
  return gulp.src(projPath.src.fonts)
    .pipe(gulp.dest(projPath.build.fonts));
});
// =====================================================================================================================

// Clear tasks==========================================================================================================
gulp.task('clear', function() {
  return del(buildDir);
});

gulp.task('modules:clear', function() {
  return del(projPath.build.modules);
});

gulp.task('fonts:clear', function() {
  return del(projPath.build.fonts);
});
// =====================================================================================================================

// Smart-grid ==========================================================================================================
gulp.task('grid', function(done) {
  const gridSettings = {
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % || rem */
    mobileFirst: true, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
      maxWidth: '1306px', /* max-width оn very large screen */
      fields: '30px' /* side fields */
    },
    breakPoints: {
      lg: {
        width: '1366px',
        offset: '30px'
      },
      md: {
        width: '768px'
      },
      sm: {
        width: '480px'
      },
      xs: {
        width: '320px'
      }
    }
  };

  smartgrid(projPath.src.modules + '/smart-grid', gridSettings);
  done();
});
// =====================================================================================================================

// Combine =============================================================================================================
gulp.task('modules', gulp.series('modules:clear', 'modules:build'));
gulp.task('fonts', gulp.series('fonts:clear', 'fonts:build'));
gulp.task('build', gulp.series(
  gulp.parallel('clear', 'modules:clear'),
  gulp.parallel('css:build', 'js:build', 'sprites:build', 'html:build', 'fonts:build', 'modules:build', 'other:build')));
// =====================================================================================================================

// Watcher =============================================================================================================
function watch() {
  if(isSync) {
    browserSync.init({
      server: {
        baseDir: projPath.build,
      }
    });

    gulp.watch('./src/css/**/*.*', gulp.parallel('css:build'));
    gulp.watch(projPath.watch.js, gulp.parallel('js:build'));
    gulp.watch(projPath.watch.html, gulp.parallel('html:build'));
    gulp.watch(projPath.watch.sprites, gulp.parallel('sprites:build'));
  } else {
    console.log('isSync === false\nTask is stopping...');
  }
}

gulp.task('watch', gulp.series('build', watch));
// =====================================================================================================================
