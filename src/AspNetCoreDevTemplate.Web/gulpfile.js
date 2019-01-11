const gulp = require("gulp");
const babel = require("gulp-babel");
const print = require("gulp-print").default;
const clean = require("gulp-clean");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const changed = require("gulp-changed");
const mapSources = require("@gulp-sourcemaps/map-sources");
const merge = require("merge-stream");

gulp.task("clean-scripts", function() {
  return gulp
    .src("wwwroot/js/dist/**/*.js", {
      read: false
    })
    .pipe(clean());
});

gulp.task(
  "js-build:dev",
  function() {
    return gulp
      .src("wwwroot/js/src/**/*.js")
      .pipe(changed("wwwroot/js/dist"))
      .pipe(print())
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(
        babel({
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
        plugins: ["@babel/plugin-transform-modules-umd"]
        })
      )
      .pipe(
        mapSources(function(sourcePath, file) {
          return "/js/src/" + sourcePath;
        })
      )
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("wwwroot/js/dist"));
  },
  gulp.series(["clean-scripts"])
);

gulp.task("copy-lib", function() {
  const libraryPaths = [
    "./node_modules/jquery/**/*",
    "./node_modules/jquery-validation/**/*",
    "./node_modules/jquery-validation-unobtrusive/**/*",
    "./node_modules/requirejs/**/*",
    "./node_modules/@types/**/*",
    "./node_modules/bootstrap/**/*"
  ];
  var tasks = libraryPaths.map(function(path) {
    return gulp
      .src(path, { base: "./node_modules" })
      .pipe(gulp.dest("./wwwroot/lib"));
  });
  return merge(tasks);
});

gulp.task(
  "js-build:prod",
  function() {
    return gulp
      .src("wwwroot/js/src/**/*.js")
      .pipe(print())
      .pipe(
        babel({
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
          plugins: ["@babel/plugin-transform-modules-umd"]
        })
      )
      .pipe(
        rename({
          suffix: ".min"
        })
      )
      .pipe(uglify())
      .pipe(gulp.dest("wwwroot/js/dist"));
  },
  gulp.series(["clean-scripts"])
);

gulp.task("watch:js-src", function() {
  return gulp.watch("wwwroot/js/src/**/*.js", gulp.series(["js-build:dev"]));
});
