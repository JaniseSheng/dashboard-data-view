const gulp = require('gulp');
const gutil = require('gulp-util');
const browserify = require('browserify');
const babelify = require('babelify');
const streamify = require('gulp-streamify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const del = require('del');
const webserver = require('gulp-webserver');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');
const jade = require('gulp-jade');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

const config = {
    src: 'src/',
    dist: 'dist/',
    'jade-path': 'src/jade/index.jade',
    'less-path': 'src/less/',
    'js-path': 'src/js/'
}

gulp.task("template", function () {
    gulp.src('src/jade/index.jade')
        .pipe(plumber())
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest('dist/'))
        .pipe(livereload());
});


/**
 * todo: less编译任务
 */
gulp.task('style', function () {
    gulp.src('src/less/main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'))
        .pipe(livereload());
});


/**
 * todo: 其他不适用import进行导入的依赖包进行合并并压缩
 */
gulp.task('vendor', () => {
    return gulp.src([
        'src/js/jquery.min.js',
        'src/js/echarts.min.js'
    ]).pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/'));
});



/**
 * todo: 打包编译手写的代码
 */
gulp.task('bundle', () => {
    return browserify([
        'src/js/main.js'
    ])
        .transform(babelify, {presets: ["es2015", "stage-0"]}) // es6翻译成es5
        .bundle() // 打包代码
        .pipe(source('bundle.js')) // 打包名称为bundle.js
        //.pipe(streamify(uglify())) //参数 混淆 mangle: false
        .pipe(gulp.dest('dist/'))
        .pipe(livereload());
});

/**
 * todo: 代码添加source-map
 */
gulp.task('js-scoure-map', function() {
    gulp.src('dist/bundle.js')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('dist/'))
        .pipe(gulp.dest('dist'));
});

/**
 * todo: 侦听less有变化并编译
 */
gulp.task('styles-watch', () => {
    gulp.watch(("src/**/*.less"), ['style']);
});

/**
 * todo: 侦听less有变化并编译
 */
gulp.task('js-watch', () => {
    gulp.watch(("src/**/*.js"), ['bundle']);
});


// 监听任务
gulp.task("jade-watch", function () {
    livereload.listen();
    // 监听jade变化并执行jade编译任务
    gulp.watch("./src/**/*.jade", function () {
        gulp.run("template");
    });
});




/**
 * todo: 用于npmstart, (开发模式)
 */
gulp.task('default', [
    'style',
    'styles-watch',
    'template',
    'jade-watch',
    'vendor',
    'bundle',
    'js-watch'
], () => {
    gutil.log(gutil.colors.green('进入开发模式,监听事件已经打开。。。。。。'));
});
