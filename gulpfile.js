var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var through2 = require('through2');



gulp.task('ng-template-build', function () {
  gulp
    .src('src/**/*.html')
    .pipe(through2.obj(function(file, _, cb){
      file.path += ".js";
      var prefix = 'var t =';
      var suffix = ';\nmodule.exports = t;\n';
      var newC = prefix + JSON.stringify(file.contents.toString()) + suffix;
      file.contents = new Buffer(newC);
      this.push(file);
      cb();
    }))
    .pipe(gulp.dest('./build/src'))
    ;
});



gulp.task('ng-styles-build',['ng-less-build'],function () {
  return gulp
    .src('build/src/**/*.css')
    .pipe(through2.obj(function(file, _, cb){
      file.path += ".js";
      var prefix = 'var style =';
      var suffix = ';\nmodule.exports = style;\n';
      var newC = prefix + JSON.stringify(file.contents.toString()) + suffix;
      file.contents = new Buffer(newC);
      this.push(file);
      cb();
    }))
    .pipe(gulp.dest('./build/src'))
    ;
});

gulp.task('ng-less-build', function() {
  return gulp
    .src('src/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('build/src'));
});

gulp.task('watch',['ng-template-build', 'ng-styles-build'],function(){
    gulp.watch('src/**/*.html', ['ng-template-build']);
    gulp.watch('src/**/*.less', ['ng-styles-build']);
});

gulp.task('build', ['ng-template-build', 'ng-styles-build']);
