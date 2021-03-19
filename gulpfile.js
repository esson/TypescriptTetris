var gulp = require('gulp');
var webserver = require('gulp-webserver');
var typescript = require('gulp-typescript');
var typescriptProject = typescript.createProject('tsconfig.json');

gulp.task('ts', function () {
  return typescriptProject.src()
    .pipe(typescriptProject())
    .js.pipe(gulp.dest('dist/js'));
});

gulp.task('serve', function () {
  return gulp.src('dist/')
    .pipe(webserver({
      port: 3000,
      livereload: true
    }));
});

gulp.task('js', function () {
  return gulp.src(['node_modules/requirejs/require.js'])
    .pipe(gulp.dest('dist/vendor'));
});

gulp.task('default', gulp.series('ts', 'js'));