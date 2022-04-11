import gulp from 'gulp';
import async from 'async';
import iconfont from 'gulp-iconfont';
import consolidate from 'gulp-consolidate';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';
import autoprefix from 'gulp-autoprefixer';
import minifyCSS from 'gulp-minify-css';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import del from 'del';
import sourcemaps from 'gulp-sourcemaps';

const runTimestamp = Math.round(Date.now() / 1000);

const sass = gulpSass(dartSass);

gulp.task('imagemin', function () {
  var img_src = 'src/images/**/*';
  var img_dest = 'build/images';

  return gulp.src(img_src)
    .pipe(changed(img_dest))
    .pipe(imagemin())
    .pipe(gulp.dest(img_dest));
});

gulp.task('styles', function () {
  return gulp.src(['src/styles/*.css'])
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 version'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/styles'));
});

gulp.task('sass', function() {
  return gulp.src('src/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 version'))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('build/styles'));
});

gulp.task('js', function () {
  return gulp.src('src/scripts/*.js')
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('watch', function () {
  gulp.watch('src/styles/*.css', gulp.series('styles'));
  gulp.watch('src/styles/*.scss', gulp.series('sass'));
  gulp.watch('src/images/**/*', gulp.series('imagemin'));
  gulp.watch('src/scripts/*.js', gulp.series('js'));
});

gulp.task('clean', function () {
  return del(['build/styles/styles.css']);
});

gulp.task('default', gulp.series('clean', 'styles', 'sass', 'imagemin', 'js'));

