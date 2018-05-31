const babel = require("gulp-babel");
const gulp = require("gulp");
const concat = require("gulp-concat");
const watch = require("gulp-watch");


const chemins = {
  demo: "./docs/demo/modules/json-better-parser/distrib/",
  demoSrc: "./docs/demo"
};

gulp.task("json-better-parser.min.js", () => {
  return gulp.src([
      "sources/json-better-parser.js"
    ])
    .pipe(concat("json-better-parser.min.js"))
    .pipe(babel({
      presets: ["es2017"],
      compact: true
    }))
    .pipe(gulp.dest("distrib"))
});

gulp.task("json-better-parser-es2015.min.js", () => {
  return gulp.src([
      "sources/json-better-parser.js"
    ])
    .pipe(concat("json-better-parser-es2015.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: true
    }))
    .pipe(gulp.dest("distrib"))
});

gulp.task("watch:json-better-parser.min.js", function() {
  watch("./sources/json-better-parser.js", function() {
    gulp.run("json-better-parser.min.js");
  });
});

gulp.task("vendor", () => {
  return gulp.src([
      "node_modules/htmlelement-extension/distrib/htmlElement.min.js"
    ])
    .pipe(gulp.dest(chemins.demoSrc))
})

gulp.task("demo", ["json-better-parser.min.js"], () => {
  return gulp.src([
      "sources/json-better-parser.js"
    ])
    .pipe(concat("json-better-parser.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: false
    }))
    .pipe(gulp.dest(chemins.demo))
});


gulp.task("default", ["json-better-parser.min.js", "demo"]);

gulp.task("tests", ["json-better-parser.min.js"]);

gulp.task("release", ["json-better-parser.min.js", "json-better-parser-es2015.min.js", "demo", "vendor"]);



gulp.task("all", ["default"]);

gulp.task("watch", ["watch:json-better-parser.min.js"]);