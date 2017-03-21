var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('compress', ['concat'], function (cb) {
    pump([
            gulp.src('dist/extjs4-orgchart.js'),
            uglify(),
            gulp.dest('dist')
        ],
        cb
    );
});

gulp.task('concat', function () {
    return gulp.src([
        './src/Settings.js',
        './src/Node.js',
        './src/Expander.js',
        './src/Connector.js',
        './src/OrgChart.js'
    ]).pipe(concat('extjs4-orgchart.js'))
        .pipe(gulp.dest('./dist/'));
});


gulp.task('default', ['compress']);