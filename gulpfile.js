var gulp = require('gulp');
var jsdoc = require('gulp-jsdoc3');
var concat = require('gulp-concat');

gulp.task('scripts', function () {
    return gulp.src([
        './src/Settings.js',
        './src/Node.js',
        './src/Expander.js',
        './src/Connector.js',
        './src/OrgChart.js'
    ]).pipe(concat('extjs4-orgchart.js'))
        .pipe(gulp.dest('./dist/'));
});


/*
gulp.task('doc', function (cb) {
    gulp.src(['README.md', './src/!*.js'], {read: false})
        .pipe(jsdoc(cb));
});
*/


gulp.task('default', [/*'doc',*/ 'scripts']);