var gulp = require('gulp')
var babel = require('gulp-babel')
var print = require('gulp-print').default
var clean = require('gulp-clean')
var uglify = require('gulp-uglify')
var umd = require('gulp-umd')
var  plumber = require('gulp-plumber');

gulp.task('clean-scripts', function () {
    return gulp.src('wwwroot/js/dist/**/*.js', {
            read: false
        })
        .pipe(clean());
});

gulp.task("js-build",function(){
  return gulp
      .src('wwwroot/js/src/**/*.js') // #1. select all js files in the app folder
      .pipe(print()) // #2. print each file in the stream
       .pipe(plumber())
      .pipe(babel({
          presets: ['@babel/env'],
          plugins:[
                '@babel/plugin-transform-modules-umd',
          ]
      })) // #3. transpile ES2015 to ES5 using ES2015 preset
       .pipe(uglify())
      .pipe(gulp.dest('wwwroot/js/dist')) // #4. copy the results to the build folder
})



