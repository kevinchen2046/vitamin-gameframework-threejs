const fs = require('fs');

function getFiles(path, ext) {
    var result = [];
    var files = fs.readdirSync(path);
    for (var file of files) {
        if (fs.statSync(path + file).isDirectory()) {
            result = result.concat(getFiles(path + file + '/', ext));
            continue;
        }
        if (file.indexOf(ext) > 0) {
            result.push(path + file);
        }
    }
    return result;
}

var files = getFiles("./", '.d.ts');

for (var i = 0; i < files.length; i++) {
    var content = fs.readFileSync(files[i], "utf-8");
    var lines = content.split("\n");
    while (lines[0].indexOf('import') == 0) {
        lines.shift();
    }
    files[i] = lines.join("\n");
}
fs.writeFileSync('./index.d.ts',files.join('\n'),'utf-8');