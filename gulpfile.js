const gulp = require('gulp');
const pug = require('gulp-pug');
const del = require('del');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

// for cleaning files at dist package
function cleanExtFiles(ext) {
    return del([`dist/**/*.${ext}`, `!dist/**/vendor/*.*`]);
}

function cleanVendors() {
    return del(['dist/**/vendor/*.*']);
}

function cleanImg() {
    return del(['dist/img/*.*']);
}

// distribution package cleaning
function clean(cb) {
    cleanExtFiles('html');
    cleanExtFiles('css');
    cleanExtFiles('js');
    cleanImg();
    cleanVendors();
    cb();
}

// distribution packaging
function build(cb) {
    buildPug();
    buildCss();
    buildJs();
    distImg();
    distVendor();
    cb();
}

function buildPug() {
    return gulp.src(['src/templates/*.pug'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
}

function buildCss() {
    return gulp.src(['src/css/**/*.scss'])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

function buildJs() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
}

function distImg() {
    return gulp.src(['src/img/**/*.*'])
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
}

function distVendor() {
    return gulp.src(['src/**/vendor/*.*'])
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
}

// create virtual server
function serve() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });

    // watch here
    gulp.watch('src/templates/**/*.pug').on('change', () => {
        cleanExtFiles('html');
        buildPug();
    });

    gulp.watch('src/css/**/*.scss').on('change', () => {
        cleanExtFiles('css');
        buildCss();
    });

    gulp.watch('src/js/**/*.js').on('change', () => {
        cleanExtFiles('js');
        buildJs();
    });

    gulp.watch('src/img/**/*.*').on('change', () => {
        cleanImg();
        distImg();
    });

    gulp.watch(['src/css/vendor/*.css', 'src/js/vendor/*.js']).on('change', () => {
        cleanVendors();
        distVendor();
    });
}

exports.clean = clean;
exports.build = gulp.series([clean, build]);
exports.default = gulp.series([clean, build], serve);