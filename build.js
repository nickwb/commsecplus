var _ = require('underscore'),
    q = require('q'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    browserify = require('browserify');
    

function buildHook(fileName) {
    var inFile = './src/hooks/' + fileName;
    var outFile = './build/hooks/' + fileName;
    
    var b = browserify();
    b.add(inFile);
    
    var output = fs.createWriteStream(outFile);
    
    output.on('open', function() {
        b.bundle().pipe(output);
    });
    
    output.on("error", function(e) {
        console.log('Write Error');
        console.log(e);
    });
}

fs.readdir('./src/hooks', function(err, files) {
    if(err) { throw 'Could not read /src/hooks'; }
    mkdirp('./build/hooks', function(err) {
        if(err) { throw 'Could not create directory /build/hooks'; }
        _.each(files, buildHook);
    });
});