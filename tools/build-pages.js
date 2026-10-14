
/* ======================================
   Project Library
   Cloudflare Pages Build
   Version 1.0
   ======================================

   SEOページを生成し、
   公開に必要なファイルだけを
   dist/ にコピーする
   ====================================== */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

// --------------------------------------
// SEOページ生成
// --------------------------------------

console.log("Generating SEO pages...");

execFileSync(
  process.execPath,
  [path.join(root, "tools", "generate-seo.js")],
  {
    cwd: root,
    stdio: "inherit"
  }
);

// --------------------------------------
// 公開フォルダ初期化
// --------------------------------------

fs.rmSync(dist, {
  recursive: true,
  force: true
});

fs.mkdirSync(dist, { recursive: true });

// --------------------------------------
// コピー用関数
// --------------------------------------

function copy(relativePath) {
  const source = path.join(root, relativePath);
  const destination = path.join(dist, relativePath);

  if (!fs.existsSync(source)) {
    throw new Error(
      "Required file or directory not found: " +
      relativePath
    );
  }

  fs.mkdirSync(path.dirname(destination), {
    recursive: true
  });

  fs.cpSync(source, destination, {
    recursive: true
  });

  console.log("Copied:", relativePath);
}

// --------------------------------------
// 公開するHTML
// --------------------------------------

const publicHtml = [
  "index.html",
  "library.html",
  "work.html",
  "compare.html",
  "terms.html",
  "privacy.html",
  "contact.html"
];

for (const file of publicHtml) {
  if (fs.existsSync(path.join(root, file))) {
    copy(file);
  }
}

// --------------------------------------
// 必要な公開用ファイル
// --------------------------------------

[
  "assets",
  "components",
  "works",
  "sitemap.xml"
].forEach(copy);

// --------------------------------------
// 検索エンジンのクロール抑制
// テストサイト専用
// --------------------------------------

fs.writeFileSync(
  path.join(dist, "robots.txt"),
  "User-agent: *\nDisallow: /\n",
  "utf8"
);

// --------------------------------------
// Cloudflare Pages設定
// --------------------------------------

fs.writeFileSync(
  path.join(dist, "_headers"),
  "/*\n  X-Robots-Tag: noindex, nofollow\n",
  "utf8"
);

console.log("Cloudflare Pages build completed.");
console.log("Output directory: dist");
