const gulp = require('gulp'),
    ts = require('gulp-typescript'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    babel = require('gulp-babel');

gulp.task('default', function () {
    const tsProject = ts.createProject('tsconfig.json');
    const tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest(__dirname + "/build/application"));
});
