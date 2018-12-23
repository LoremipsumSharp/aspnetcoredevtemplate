const gulp = require('gulp')
const babel = require('gulp-babel')
const print = require('gulp-print').default
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const rename = require("gulp-rename")
const watch = require("gulp-watch")
const changed = require('gulp-changed')

gulp.task('clean-scripts', function () {
    return gulp.src('wwwroot/js/dist/**/*.js', {
            read: false
        })
        .pipe(clean());
});

// 开发环境（有sourceMap，构建后的源文件不压缩）
gulp.task("js-build:dev", function () {
    return gulp
        .src('wwwroot/js/src/**/*.js')
        .pipe(changed('wwwroot/js/dist'))
        .pipe(print())
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [
                [
                    "@babel/env",
                    {
                        targets: {

                            browsers: ["since 2015", "ie >= 10"]
                        }
                    }
                ]
            ],
            plugins: [
                '@babel/plugin-transform-modules-umd',
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('wwwroot/js/dist'))

})

// 生产+测试（没有sourceMap，对文件做压缩处理）
gulp.task("js-build:prod", function () {
    return gulp
        .src('wwwroot/js/src/**/*.js')
        .pipe(print())
        .pipe(babel({
            presets: [
                [
                    "@babel/env",
                    {
                        targets: {

                            browsers: ["since 2015", "ie >= 10"]
                        }
                    }
                ]
            ],
            plugins: [
                '@babel/plugin-transform-modules-umd',
            ]
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('wwwroot/js/dist'))
})


gulp.task("js-build", gulp.series(["clean-scripts",
    "js-build:dev", "js-build:prod"
]))


gulp.task('watch:js-src', function () {
    return gulp.watch('wwwroot/js/src/**/*.js', gulp.series(['js-build:dev']));
});