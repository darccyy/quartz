var fs = require("fs");
var path = require("path");
var F = require("fortissimo");
var filename = path.join(__dirname, "./index.qtz");
function main() {
    var file = fs.readFileSync(filename).toString();
    var tree = parse(file).tree;
    console.log(tree);
    fs.writeFileSync(path.join(__dirname, "temp/0.json"), JSON.stringify(tree, null, 2));
}
main();
function parse(string, iter) {
    if (iter === void 0) { iter = 0; }
    var tree = [];
    function pushBuild(string) {
        if (string === void 0) { string = build; }
        if (string) {
            tree.push(string);
        }
    }
    var build = "";
    var isEarlyReturn = false;
    var scope = [];
    for (var i = 0; i < string.length; i++) {
        var char = string[i];
        console.log(char);
        if (char === "(") {
            pushBuild();
            build = "";
            var _a = parse(string.slice(i + 1), iter + 1), branch = _a.tree, index = _a.index;
            if (index < 1) {
                //TODO Fix empty brackets
                // throw "Empty brackets";
            }
            tree.push(branch);
            if (index < 0) {
                throw "Premature termination";
            }
            i += index + 1;
            continue;
        }
        if (char === ")") {
            isEarlyReturn = true;
            break;
        }
        switch (scope.slice(-1)[0]) {
            case "args":
                if (char === ",") {
                    pushBuild();
                }
                break;
        }
        build += char;
    }
    pushBuild();
    if (isEarlyReturn) {
        if (iter <= 0) {
            throw "Close bracket mismatch";
        }
        return { tree: tree, index: i };
    }
    if (iter > 0) {
        throw "Open bracket mismatch";
    }
    return { tree: tree, index: -1 };
}
