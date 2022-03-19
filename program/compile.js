var fs = require("fs");
var F = require("fortissimo");
function main() {
    var file = "(" + fs.readFileSync(__dirname + "/index.qtz").toString() + ")";
    log(file);
    var parsed = parse(file, 0).output;
    fs.writeFileSync(__dirname + "/temp/0.json", JSON.stringify(parsed, null, 2));
    var compiled = compile(parsed, 0);
    fs.writeFileSync(__dirname + "/temp/1.json", JSON.stringify(compiled, null, 2));
    var date = new Date();
    log("\n" +
        date.getHours() +
        ":" +
        F.fill(date.getMinutes(), 2, 0, true) +
        ":" +
        F.fill(date.getSeconds(), 2, 0, true));
}
function compile(parsed, iter) {
    var output = [];
    for (var i = 0; i < parsed.length; i++) {
        var item = parsed[i];
        if (typeof item === "object") {
            output.push(compile(item, iter + 1));
        }
        else if (item === "FUNCTION") {
            output.pop();
            var method = {
                method: "call",
                name: parsed[i - 1] || null,
                args: compile(parsed[i + 1] || [], iter + 1)
            };
            output.push(method);
            i++;
        }
        else {
            var args = [];
            var type = null;
            var current = "";
            for (var j = 0; j < item.length; j++) {
                var char = item[j];
                if ("+-/*".includes(char)) {
                    type = char;
                    if (current) {
                        args.push(current);
                    }
                    current = "";
                    continue;
                }
                if (" ".includes(char)) {
                    continue;
                }
                current += char;
            }
            if (current) {
                // log(current, compile(current, iter + 1));
                args.push(current);
            }
            // log(type, args);
            if (!args[0]) {
                continue;
            }
            var method = type
                ? {
                    method: type || "none",
                    args: args
                }
                : {
                    method: "none",
                    name: args[0]
                };
            output.push(method);
        }
    }
    if (output.length === 1) {
        return output[0];
    }
    return output;
}
function parse(string, iter) {
    var output = [];
    var current = "";
    var isFunction = false;
    for (var i = 0; i < string.length; i++) {
        var char = string[i];
        // log(char, iter, i);
        if (char === "(") {
            // log("---");
            if (current) {
                output.push(current);
            }
            current = "";
            var parsed = parse(string.slice(i + 1), iter + 1);
            if (isFunction) {
                // log("FUNCTION");
                output.push("FUNCTION");
            }
            isFunction = false;
            output.push(parsed.output);
            i += parsed.index + 1;
            // log(i);
            // log(">", string.slice(0, i));
            continue;
        }
        if (char === ")") {
            // log("-".repeat(10), iter);
            if (current) {
                output.push(current);
            }
            // log(i);
            return { output: output, index: i };
        }
        if (",;".includes(char)) {
            isFunction = false;
            if (current) {
                output.push(current);
            }
            current = "";
            continue;
        }
        if ("\r\n".includes(char)) {
            continue;
        }
        if (char !== " ") {
            isFunction = true;
        }
        current += char;
    }
    if (current) {
        output.push(current);
    }
    console.log("-".repeat(5), "end");
    return { output: output, index: -1 };
}
var logs = [];
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log.apply(console, args);
    logs.push(args);
    fs.writeFileSync(__dirname + "/temp/output.log", logs.map(function (i) { return i.join(" "); }).join("\r\n"));
}
main();
