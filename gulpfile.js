const babel = require("gulp-babel");
const gulp = require("gulp");
const concat = require("gulp-concat");
const watch = require("gulp-watch");


const chemins = {
  demo: "./docs/demo/modules/positionizer/distrib/",
  demoSrc: "./docs/demo"
};

gulp.task("positionizer.min.js", () => {
  return gulp.src([
      "sources/positionizer.js"
    ])
    .pipe(concat("positionizer.min.js"))
    .pipe(babel({
      presets: ["es2017"],
      compact: true
    }))
    .pipe(gulp.dest("distrib"))
});

gulp.task("positionizer-es2015.min.js", () => {
  return gulp.src([
      "sources/positionizer.js"
    ])
    .pipe(concat("positionizer-es2015.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: true
    }))
    .pipe(gulp.dest("distrib"))
});

gulp.task("watch:positionizer.min.js", function() {
  watch("./sources/positionizer.js", function() {
    gulp.run("positionizer.min.js");
  });
});

gulp.task("vendor", () => {
  return gulp.src([
      "node_modules/htmlelement-extension/distrib/htmlElement.min.js"
    ])
    .pipe(gulp.dest(chemins.demoSrc))
})

gulp.task("demo", ["positionizer.min.js"], () => {
  return gulp.src([
      "sources/positionizer.js"
    ])
    .pipe(concat("positionizer.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: false
    }))
    .pipe(gulp.dest(chemins.demo))
});


gulp.task("default", ["positionizer.min.js", "demo"]);

gulp.task("tests", ["positionizer.min.js"]);

gulp.task("release", ["positionizer.min.js", "positionizer-es2015.min.js", "demo", "vendor"]);



gulp.task("all", ["default"]);

gulp.task("watch", ["watch:positionizer.min.js"]);