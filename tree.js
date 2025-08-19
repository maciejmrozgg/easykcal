const fs = require("fs");
const path = require("path");

function printTree(dir, prefix = "") {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.name === "node_modules" || file.name === ".git") continue;

    const isLast = i === files.length - 1;
    console.log(prefix + (isLast ? "+-- " : "|-- ") + file.name);

    if (file.isDirectory()) {
      printTree(
        path.join(dir, file.name),
        prefix + (isLast ? "    " : "|   ")
      );
    }
  }
}

printTree(".");