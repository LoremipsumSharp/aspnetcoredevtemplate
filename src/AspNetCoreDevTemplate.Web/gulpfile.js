const gulp = require("gulp");
var gutil = require('gulp-util');
var path = require('path');
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
const ts = require('gulp-typescript');
const fse = require('fs-extra');

gulp.task("clean-scripts", function () {
  return gulp
    .src("wwwroot/js/dist/**/*", {
      read: false
    })
    .pipe(clean());
});
gulp.task("ts-compile", function () {
  var tsProject = ts.createProject('./tsconfig.json', {
    outDir: './wwwroot/ts/dest'
  });
  var tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('./wwwroot/js/src'));
})


gulp.task("copy-lib", function () {
  const libraryPaths = [
    "./node_modules/jquery/**/*",
    "./node_modules/jquery-validation/**/*",
    "./node_modules/jquery-validation-unobtrusive/**/*",
    "./node_modules/requirejs/**/*",
    "./node_modules/@types/**/*",
    "./node_modules/bootstrap/**/*",
    "./node_modules/tui-editor/**/*",
    "./node_modules/highlight.js/**/*",
    "./node_modules/codemirror/**/*"
  ];
  var tasks = libraryPaths.map(function (path) {
    return gulp
      .src(path, { base: "./node_modules" })
      .pipe(gulp.dest("./wwwroot/lib"));
  });
  return merge(tasks);
});


gulp.task(
  "js-build:dev",
  gulp.series(["clean-scripts", 'ts-compile'], function () {
    return gulp
      .src("./wwwroot/js/src/**/*.js")
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
          }).transform("browserify-css", {
            minify: true,
            global: true,
            rootDir: './wwwroot',
            processRelativeUrl: function (relativeUrl) {
              gutil.log(relativeUrl)
              var stripQueryStringAndHashFromPath = function (url) {
                return url.split('?')[0].split('#')[0];
              };
              var rootDir = path.resolve(process.cwd(), 'wwwroot');
              gutil.log(rootDir)
              var relativePath = stripQueryStringAndHashFromPath(relativeUrl);
              var queryStringAndHash = relativeUrl.substring(relativePath.length);

              //
              // Copying files from '../node_modules/bootstrap/' to 'dist/vendor/bootstrap/'
              //
              var prefix = '../node_modules/';

              var vendorPath = 'lib/' + relativePath.substring(prefix.length);
              var source = path.join(rootDir, relativePath);
              var target = path.join(rootDir, vendorPath);

              gutil.log('Copying file from ' + JSON.stringify(source) + ' to ' + JSON.stringify(target));
              fse.copySync(source, target);

              // Returns a new path string with original query string and hash fragments
              return vendorPath + queryStringAndHash;
            }
          })
          .bundle()
      }))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write(".", {
        mapSources: function (sourcePath, file) {
          return sourcePath.replace("wwwroot", '')
        }
      }))
      .pipe(gulp.dest("./wwwroot/js/dist", { "overwrite": true }));
  }))







gulp.task(
  "js-build:prod",
  gulp.series(["ts-compile", "clean-scripts"]), function () {
    return gulp
      .src("wwwroot/js/src/**/*.js")
      .pipe(print())
      .pipe(plumber())
      .pipe(tap(function (file) {
        file.contents = browserify(file.path)
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

gulp.task("watch:js-src", function () {
  return gulp.watch("wwwroot/js/src/**/*.js", gulp.series(["js-build:dev"]));
});
