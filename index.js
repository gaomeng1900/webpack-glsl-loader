'use strict';

var fs = require('fs');
var path = require('path');


function parse(loader, source, context, cb) {
    var imports = [];

    // lagecy
    {
        var importPattern = /@import ([.\/\w_-]+);/gi;
        var match = importPattern.exec(source);
    
        while (match != null) {
            imports.push({
                key: match[1],
                target: match[0],
                content: ''
            });
            match = importPattern.exec(source);
        }
    }

    // added
    {
        var importPattern = /#import <([.\/\w_-]+)>/gi;
        var match = importPattern.exec(source);
    
        while (match != null) {
            imports.push({
                key: match[1],
                target: match[0],
                content: ''
            });
            match = importPattern.exec(source);
        }
    }

    processImports(loader, source, context, imports, cb);
}

function processImports(loader, source, context, imports, cb) {
    if (imports.length === 0) {
        return cb(null, source);
    }

    var imp = imports.pop();

    // 自动读取当前目录
    // syntactic sugar for current folder.
    if(!imp.key.startsWith('.') && !imp.key.startsWith('/') ) {
        imp.key = './' + imp.key
    }

    loader.resolve(context, imp.key + '.glsl', function(err, resolved) {
        if (err) {
            return cb(err);
        }

        loader.addDependency(resolved);
        fs.readFile(resolved, 'utf-8', function(err, src) {
            if (err) {
                return cb(err);
            }

            parse(loader, src, path.dirname(resolved), function(err, bld) {
                if (err) {
                    return cb(err);
                }

                source = source.replace(imp.target, bld);
                processImports(loader, source, context, imports, cb);
            });
        });
    });
}

module.exports = function(source) {
    this.cacheable();
    var cb = this.async();
    parse(this, source, this.context, function(err, bld) {
        if (err) {
            return cb(err);
        }

        cb(null, 'module.exports = ' + JSON.stringify(bld));
    });
};
