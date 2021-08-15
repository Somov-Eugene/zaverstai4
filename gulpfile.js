"use strict";

const gulp = require("gulp");
const del = require("del");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const server = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify");

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp
    .src(["source/fonts/**/*.{woff,woff2}", "source/img/**", "source/*.ico"], {
      base: "source",
    })
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("sprite", function () {
  return gulp
    .src("source/img/*.svg")
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("images", function () {
  return gulp
    .src("source/img/**/*.{png,jpg,svg}")
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp
    .src("source/*.html")
    .pipe(posthtml([include()]))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("build"));
});

gulp.task("js", function () {
  return gulp
    .src("source/js/**/*.js")
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulp.dest("build/js"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/js/**/*.js", gulp.series("js", "refresh"));
});

gulp.task(
  "build",
  gulp.series("clean", "copy", "css", "images", "webp", "sprite", "js", "html")
);

gulp.task("start", gulp.series("build", "server"));
