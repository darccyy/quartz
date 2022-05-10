const fs = require("fs");
const path = require("path");
const F = require("fortissimo");

const filename = path.join(__dirname, "./index.qtz");

function main(): void {
  const file = fs.readFileSync(filename).toString();
  var { tree } = parse(file);
  console.log(tree);
  fs.writeFileSync(
    path.join(__dirname, "temp/0.json"),
    JSON.stringify(tree, null, 2),
  );
}
main();

type parsed = {
  tree: any[];
  index: number;
};
function parse(string: string, iter: number = 0): parsed {
  var tree = [];

  function pushBuild(string = build): void {
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
      var { tree: branch, index } = parse(string.slice(i + 1), iter + 1);

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
    return { tree, index: i };
  }

  if (iter > 0) {
    throw "Open bracket mismatch";
  }
  return { tree, index: -1 };
}
