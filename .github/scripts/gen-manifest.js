const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const distDir = path.join(__dirname, "../../dist");

const pkg = require("../../package.json");
const manifest = {
  version: pkg.version,
  files: {}
};

const files = fs.readdirSync(distDir).filter((f) =>
  /^qidian-decryptor-(win|linux|macos)/.test(f)
);

const shaSums = [];

files.forEach((file) => {
  const filePath = path.join(distDir, file);
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash("sha256").update(content).digest("hex");
  shaSums.push(`${hash}  ${file}`);

  let platform = file.includes("win") ? "win" :
                 file.includes("linux") ? "linux" :
                 file.includes("macos") ? "macos" : "unknown";

  manifest.files[platform] = {
    file,
    sha256: hash
  };
});

fs.writeFileSync(path.join(distDir, "SHA256SUMS"), shaSums.join("\n"));
fs.writeFileSync(path.join(distDir, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log("SHA256SUMS 和 manifest.json 已生成");
