const gulp = require("gulp");
const babel = require("gulp-babel");
const print = require("gulp-print").default;
const clean = require("gulp-clean");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const changed = require("gulp-changed");
const merge = require("merge-stream");
const browserify = require('browserify')
const tap = require('gulp-tap')
const babelify = require('babelify')
const buffer = require('gulp-buffer')

gulp.task("clean-scripts", function () {
  return gulp
    .src("wwwroot/js/dist/**/*", {
      read: false
    })
    .pipe(clean());
});

gulp.task(
  "js-build:dev",
  gulp.series("clean-scripts", function () {
    return gulp
      .src("wwwroot/js/src/**/*.js")
      .pipe(changed("wwwroot/js/dist"))
      .pipe(print())
      .pipe(plumber())
      .pipe(tap(function (file) {
        file.contents = browserify(file.path, { debug: true })
          .transform(babelify, {
            presets: [
              [
                "@babel/env",
                {
                  targets: {
                    browsers: ["since 2015", "ie >= 10"]
                  }
                }
              ]
            ]
          }).bundle()
      }))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write(".", {
        mapSources: function (sourcePath, file) {
          return sourcePath.replace("wwwroot", '')
        }
      }))
      .pipe(gulp.dest("wwwroot/js/dist", { "overwrite": true }));
  })
);



gulp.task("copy-lib", function () {
  const libraryPaths = [
    "./node_modules/jquery/**/*",
    "./node_modules/jquery-validation/**/*",
    "./node_modules/jquery-validation-unobtrusive/**/*",
    "./node_modules/requirejs/**/*",
    "./node_modules/@types/**/*",
    "./node_modules/bootstrap/**/*"
  ];
  var tasks = libraryPaths.map(function (path) {
    return gulp
      .src(path, { base: "./node_modules" })
      .pipe(gulp.dest("./wwwroot/lib"));
  });
  return merge(tasks);
});



gulp.task(
  "js-build:prod",
  gulp.series("clean-scripts", function () {
    return gulp
      .src("wwwroot/js/src/**/*.js")
      .pipe(print())
      .pipe(plumber())
      .pipe(tap(function (file) {
        file.contents = browserify(file.path, { debug: true })
          .transform(babelify, {
            presets: [
              [
                "@babel/env",
                {
                  targets: {
                    browsers: ["since 2015", "ie >= 10"]
                  }
                }
              ]
            ]
          }).bundle()
      }))
      .pipe(buffer())
      .pipe(
        rename({
          suffix: ".min"
        })
      )
      .pipe(uglify())
      .pipe(gulp.dest("wwwroot/js/dist"));
  })
);

gulp.task("watch:js-src", function () {
  return gulp.watch("wwwroot/js/src/**/*.js", gulp.series(["js-build:dev"]));
});
