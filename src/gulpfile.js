var gulp = require('gulp')
var babel = require('gulp-babel')
var print = require('gulp-print').default
var clean = require('gulp-clean')
var uglify = require('gulp-uglify')
var plumber = require('gulp-plumber');

gulp.task('clean-scripts', function () {
    return gulp.src('wwwroot/js/dist/**/*.js', {
            read: false
        })
        .pipe(clean());
});

gulp.task("js-build", function () {
    return gulp
        .src('wwwroot/js/src/**/*.js')
        .pipe(print())
        .pipe(plumber())
        .pipe(babel({
            presets: [
                [
                    "@babel/env",
                    {
                        targets: {

                            browsers: ["since 2015", "ie >= 9"]
                        }
                    }
                ]
            ],
            plugins: [
                '@babel/plugin-transform-modules-umd',
            ]
        }))
        //.pipe(uglify())
        .pipe(gulp.dest('wwwroot/js/dist')) // #4. copy the results to the build folder
})