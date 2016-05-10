'use strict';

// ############ PACKAGES ############
var gulp = require('gulp');

var watch = require('gulp-watch');

var postcss = require('gulp-postcss');
var sass = require('gulp-sass');

var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

var rucksack = require('gulp-rucksack');

var mdcss = require('mdcss');
var mdcssTheme = require('mdcss-theme-github');

var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

var plumber = require('gulp-plumber');

var prettify = require('gulp-html-prettify');
var fileinclude = require('gulp-file-include');
var rename = require('gulp-rename');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var copy = require('gulp-copy');

var livereload = require('gulp-livereload');

var webserver = require('gulp-webserver');

var opn = require('opn');

var deploy = require('gulp-deploy-git');


// ############ SETTINGS ############
var settings = {
    server: {
        host: '0.0.0.0',
        port: '8080',
        livereload: {
            enable: true
        },
        directoryListing: true,
        open: false
    },
    app: 'app',
    pack: 'site',
    src: './src/',
    build: './public/',
    assets: 'assets',
    static: 'static',
    content: 'content',
    deploy: {
        repository: 'git@github.com:bautrukevich/startum.git',
        branches: ['master']
    }
}

// ############ APP ############
var appPath = {
    css: {
        file: 'styles.css',
        fileMin: 'styles.min.css',
        src: settings.src + settings.app + '/' + settings.app + '.scss',
        build: settings.build + settings.assets + '/' + settings.pack + '/css/',
        watch: settings.src + settings.app + '/**/*.scss'
    },
    js: {
        file: 'scripts.js',
        fileMin: 'scripts.min.js',
        src: settings.src + settings.app + '/' + settings.app + '.js',
        build: settings.build + settings.assets + '/' + settings.pack + '/js/',
        watch: settings.src + settings.app + '/**/*.js'
    },
    html: {
        src: settings.src + settings.app + '/layouts/*.html',
        build: settings.build,
        watch: settings.src + settings.app + '/**/*.html'
    },
    img: {
        src: settings.src + settings.app + '/' + settings.static + '/img/**/*',
        build: settings.build + settings.assets + '/' + settings.pack + '/img/',
        watch: settings.src + settings.app + '/' + settings.static + '/img/**/*'
    },
    fonts: {
        src: settings.src + settings.app + '/' + settings.static + '/fonts/**/*',
        build: settings.build + settings.assets + '/' + settings.pack + '/fonts/',
        watch: settings.src + settings.app + '/' + settings.static + '/fonts/**/*'
    },
    content: {
        src: settings.src + settings.app + '/' + settings.static + '/' + settings.content + '/**/*',
        build: settings.build + '/' + settings.content + '/',
        watch: settings.src + settings.app + '/' + settings.static + '/' + settings.content + '/**/*'
    }
}

// ############ APP:CSS ############
gulp.task('app:css', function() {

    if (argv.production) {
        var processors = [
            autoprefixer,
            //rucksack,
            cssnano
        ];
    } else {
        var processors = [
            autoprefixer,
            //rucksack
        ];
    }

    // return gulp.src(appPath.css.src)
    return gulp.src('./src/app/app.scss')
        // .pipe(gulpif(argv.watch, watch(appPath.css.watch)))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulpif(argv.production, rename(appPath.css.fileMin), rename(appPath.css.file)))
        .pipe(gulp.dest(appPath.css.build))
        .pipe(livereload());
});

// ############ APP:JS ############
gulp.task('app:js', function() {
    return gulp.src(appPath.js.src)
        // .pipe(gulpif(argv.watch, watch(appPath.js.watch)))
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(fileinclude({
            prefix: '@@',
            addRootSlash: false,
            basepath: '@root'
        }))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulpif(argv.production, rename(appPath.js.fileMin), rename(appPath.js.file)))
        .pipe(gulp.dest(appPath.js.build))
        .pipe(livereload());
});

// ############ APP:HTML ############
gulp.task('app:html', function() {
    gulp.src(appPath.html.src)
        // .pipe(gulpif(argv.watch, watch(appPath.html.watch)))
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(fileinclude({
            prefix: '@@',
            addRootSlash: false,
            basepath: '@root'
        }))
        .pipe(prettify({
            indent_char: '	',
            indent_size: 1
        }))
        .pipe(gulp.dest(appPath.html.build))
        .pipe(livereload());
});

gulp.task('app:img', function() {
    gulp.src(appPath.img.src)
        // .pipe(gulpif(argv.watch, watch(appPath.img.watch)))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }, {
                cleanupIDs: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(appPath.img.build))
        .pipe(livereload());
});

gulp.task('app:fonts', function() {
    gulp.src(appPath.fonts.src)
        // .pipe(gulpif(argv.watch, watch(appPath.fonts.watch)))
        .pipe(gulp.dest(appPath.fonts.build))
        .pipe(livereload());
});

gulp.task('app:content', function() {
    gulp.src(appPath.content.src)
        // .pipe(gulpif(argv.watch, watch(appPath.content.watch)))
        .pipe(gulp.dest(appPath.content.build))
        .pipe(livereload());
});

// ############ APP:BUILD ############
gulp.task('app:build', [
    'app:css',
    'app:js',
    'app:html',
    'app:img',
    'app:fonts',
    'app:content'
]);


// ############ PROJECT ############

// ############ BUILD PROJECT ############
gulp.task('project:build', [
    'app:build',
]);

// ############ START SERVER ############
gulp.task('project:server', function() {
    if (argv.port) {
        settings.server.port = argv.port
    }
    if (argv.browser) {
        settings.server.open = 'http://' + settings.server.host + ':' + settings.server.port + '/' + settings.build;
        settings.server.directoryListing = false;
    }
    gulp.src('./').pipe(webserver(settings.server));
});

// ############ WATCH PROJECT ############
gulp.task('project:watch', function() {
    livereload.listen({
        basePath: settings.build
    });
    if (argv.watch) {
        gulp.watch(appPath.css.watch, ['app:css']);
        gulp.watch(appPath.js.watch, ['app:js']);
        gulp.watch(appPath.html.watch, ['app:html']);
        gulp.watch(appPath.img.watch, ['app:img']);
        gulp.watch(appPath.content.watch, ['app:content']);
    }
});

// ############ DEPLOY PROJECT ############
gulp.task('project:deploy', function() {
    return gulp.src('./**/*')
        .pipe(deploy(settings.deploy));
});


// ############ START TASKS ############
gulp.task('default', ['project:build', 'project:watch', 'project:server']);
gulp.task('app', ['app:build']);
gulp.task('stop', ['project:server:stop']);
gulp.task('deploy', ['project:deploy']);
