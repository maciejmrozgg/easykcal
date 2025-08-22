const fs = require("fs");
const path = require("path");

let output = "";

function printTree(dir, prefix = "") {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.name === "node_modules" || file.name === ".git") continue;

    const isLast = i === files.length - 1;
    const line = prefix + (isLast ? "+-- " : "|-- ") + file.name + "\n";
    output += line; // zamiast console.log()

    if (file.isDirectory()) {
      printTree(
        path.join(dir, file.name),
        prefix + (isLast ? "    " : "|   ")
      );
    }
  }
}

printTree(".");
fs.writeFileSync("struktura.txt", output); // zapis do pliku
