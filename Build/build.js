var FILE_ENCODING = 'utf-8',
    SRC_DIR = '../scripts/src',
    LIBS_DIR = '../scripts/libs',
    DIST_PATH = '../mad.js',
    DIST_MIN_PATH = '../mad.min.js';
    
var _fs = require('fs'),
    _path = require('path'),
    _pkg = JSON.parse(readFile('../package.json')),
    _now = new Date(),
    _replacements = {
        NAME: _pkg.name,
        EMAIL: _pkg.author.email,
        AUTHOR: _pkg.author.name,
        VERSION_NUMBER: _pkg.version,
        HOMEPAGE: _pkg.homepage,
        LICENSE: _pkg.licenses[0].type,
        BUILD_DATE: _now.getUTCFullYear() + '/' + pad(_now.getUTCMonth() + 1) + '/' + pad(_now.getUTCDate()) + ' ' + pad(_now.getUTCHours()) + ':' + pad(_now.getUTCMinutes())
    };

function readFile(filePath) {
    return _fs.readFileSync(filePath, FILE_ENCODING);
}

function tmpl(template, data, regexp) {
    function replaceFn(match, prop) {
        return (prop in data) ? data[prop] : '';
    }
    return template.replace(regexp || /::(\w+)::/g, replaceFn);
}

function uglify(srcPath) {
    var
      uglyfyJS = require('uglify-js'),
      ast = uglyfyJS.minify([srcPath]);

    return ast.code;
}

function minify() {
    var license = tmpl(readFile(SRC_DIR + '/license.txt'), _replacements);
    // we add a leading/trailing ";" to avoid concat issues (#73)
    _fs.writeFileSync(DIST_MIN_PATH, license + ';' + uglify(DIST_PATH) + ';', FILE_ENCODING);
    console.log(' ' + DIST_MIN_PATH + ' built.');
}

function purgeDeploy() {
    [DIST_PATH, DIST_MIN_PATH].forEach(function (filePath) {
        if (_fs.existsSync(filePath)) {
            _fs.unlinkSync(filePath);
        }
    });
    console.log(' purged deploy.');
}

function build() {
    var wrapper = readFile(SRC_DIR + '/wrapper.js'),
        deploy = tmpl(wrapper, {
            license: readFile(SRC_DIR + '/license.txt'),
            signals_js: readFile(LIBS_DIR + '/signals.js'),
            crossroads_js: readFile(LIBS_DIR + '/crossroads.js'),
            zepto_expand_js: readFile(SRC_DIR + '/zepto.expand.js'),
            mad_util_js: readFile(SRC_DIR + '/mad.util.js'),
            mad_browserVariables_js: readFile(SRC_DIR + '/mad.browserVariables.js'),
            mad_core_js: readFile(SRC_DIR + '/mad.core.js'),
            mad_view_js: readFile(SRC_DIR + '/mad.view.js'),
            mad_app_js: readFile(SRC_DIR + '/mad.app.js'),
        }, /\/\/::(\w+)::\/\//g);

    _fs.writeFileSync(DIST_PATH, tmpl(deploy, _replacements), FILE_ENCODING);
    console.log(' ' + DIST_PATH + ' built.');
}

function pad(val) {
    val = String(val);
    if (val.length < 2) {
        return '0' + val;
    } else {
        return val;
    }
}

// --- run ---
purgeDeploy();
build();
minify();