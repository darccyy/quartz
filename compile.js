const fs = require("fs");

function main() {
  const file = fs.readFileSync(__dirname + "/index.qtz").toString();

  var output = parse(file, 0).output;

  fs.writeFileSync(__dirname + "/output.json", JSON.stringify(output, null, 2));
}

function parse(string, iter) {
  var output = [];
  var current = "";

  for (var i = 0; i < string.length; i++) {
    var char = string[i];
    log(char, iter, i);

    if (char === "(") {
      log();
      if (current) {
        output.push(current);
      }
      current = "";

      var parsed = parse(string.slice(i + 1), iter + 1);
      output.push(parsed.output);
      i += parsed.index + 1;
      log(i);
      log(string.slice(0, i));
      continue;
    }

    if (char === ")") {
      log("-".repeat(10), iter);
      if (current) {
        output.push(current);
      }
      log(i);
      return { output, index: i };
    }

    if (char === ",") {
      if (current) {
        output.push(current);
      }
      current = "";
      continue;
    }

    if (" \r\n".includes(char)) {
      continue;
    }

    current += char;
  }
  if (current) {
    output.push(current);
  }

  console.log("-".repeat(5), "end");
  return { output, index: -1 };
}

var logs = [];
function log(...args) {
  console.log(...args);
  logs.push(args);
  fs.writeFileSync(
    __dirname + "/output.log",
    logs.map(i => i.join(" ")).join("\r\n"),
  );
}

main();
