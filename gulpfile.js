"use strict";
const gulp = require("gulp");
const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const nunjucksRender = require("gulp-nunjucks-render");
const cssnano = require("cssnano");
const jshint = require("gulp-jshint");
const data = require("gulp-data");
const babel = require("gulp-babel");

/* variables ================================== */
const files = {
  scssPath: "src/scss/*.scss",
  jsPath: "src/js/*.js",
  nunjuck: "src/html/pages/*.+(html|nunjucks)",
  data: "./src/data/data.json",
  templates: "src/html/templates",
};

/* tasks ====================================== */
// css
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("website/css"));
}

// js
function jsTask() {
  return (
    src(files.jsPath)
      .pipe(concat("scripts.js"))
      // .pipe(uglify())
      .pipe(dest("website/js"))
  );
}

// html
function htmlTask() {
  return (
    src([files.nunjuck])
      // .pipe(
      //   data(function () {
      //     return require(files.data);
      //   })
      // )
      .pipe(
        nunjucksRender({
          path: [files.templates],
        })
      )
      .pipe(gulp.dest("website"))
  );
}

// jshint
function jshintTask() {
  return (
    src(["website/js/scripts.js"])
      // .pipe(
      //   babel({
      //     presets: ["@babel/env"],
      //   })
      // )
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"))
  );
}

// browserSync
function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: "website",
    },
  });
  cb();
}

// browserSyncReload
function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

// cache buster
const cbString = new Date().getTime();
function cacheBusterTask() {
  return src(["website/*.html"])
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("website"));
}

// watch
function watchTask() {
  watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask, htmlTask));
  watch(["website/js/scripts.js"], jshintTask);
  watch(["website/*.html"], browserSyncReload);
  watch(["src/html/**/*.+(html|nunjucks)"], htmlTask);
}

// Default task
exports.default = series(
  browserSyncServe,
  parallel(scssTask, jsTask, htmlTask),
  jshintTask,
  cacheBusterTask,
  watchTask
);
