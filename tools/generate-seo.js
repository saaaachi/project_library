
/* ======================================
   Project Library
   SEO Sitemap Generator
   Version 1.0
   ======================================

   目的：
   works.jsから作品情報を取得し、
   sitemap.xmlを自動生成する。

   対応：
   ・作品追加
   ・作品編集
   ・作品削除
   ・1000作品以上
   ・公開日、更新日
   ・XML特殊文字

   実行：
   node tools/generate-seo.js

   ====================================== */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

// --------------------------------------
// 基本設定
// --------------------------------------

const ROOT = path.resolve(__dirname, "..");

const SITE_URL =
  "https://saaaachi.github.io/project_library/";

const WORKS_PATH = path.join(
  ROOT,
  "assets",
  "data",
  "works.js"
);

const SITEMAP_PATH = path.join(
  ROOT,
  "sitemap.xml"
);

// --------------------------------------
// XML特殊文字を変換
// --------------------------------------

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// --------------------------------------
// 日付確認
// --------------------------------------

function validDate(value) {
  if (typeof value !== "string") {
    return "";
  }

  const date = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "";
  }

  const parsed = new Date(date + "T00:00:00Z");

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    return "";
  }

  return date;
}

// --------------------------------------
// works.jsを読み込む
// --------------------------------------

function loadWorks() {
  if (!fs.existsSync(WORKS_PATH)) {
    throw new Error(
      "works.jsが見つかりません。"
    );
  }

  const source = fs.readFileSync(
    WORKS_PATH,
    "utf8"
  );

  const startMarker = "const works = ";

  const endMarker =
    "// --------------------------\n// 共通関数";

  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error(
      "works.jsの配列構造を確認できません。"
    );
  }

  const expression = source
    .slice(start + startMarker.length, end)
    .trim()
    .replace(/;\s*$/, "");

  const result = vm.runInNewContext(
    expression,
    Object.create(null),
    { timeout: 5000 }
  );

  if (!Array.isArray(result)) {
    throw new Error(
      "作品データが配列ではありません。"
    );
  }

  return result;
}

// --------------------------------------
// sitemapのURL要素
// --------------------------------------

function createUrlEntry(url, lastmod = "") {
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(url)}</loc>`
  ];

  if (lastmod) {
    lines.push(
      `    <lastmod>${escapeXml(lastmod)}</lastmod>`
    );
  }

  lines.push("  </url>");

  return lines.join("\n");
}

// --------------------------------------
// sitemap生成
// --------------------------------------

function generateSitemap() {
  console.log("==============================");
  console.log("Project Library SEO Generator");
  console.log("Version 1.0");
  console.log("==============================");

  const works = loadWorks();

  console.log(`登録作品数：${works.length}件`);

  const entries = [];

  // トップページ
  entries.push(
    createUrlEntry(SITE_URL)
  );

  // 作品一覧ページ
  entries.push(
    createUrlEntry(
      SITE_URL + "library.html"
    )
  );

  // 作品詳細ページ
  const usedIds = new Set();

  for (const work of works) {
    const id = Number(work.id);

    if (
      !Number.isSafeInteger(id) ||
      id <= 0
    ) {
      throw new Error(
        `不正な作品ID：${work.id}`
      );
    }

    if (usedIds.has(id)) {
      throw new Error(
        `作品IDが重複しています：${id}`
      );
    }

    usedIds.add(id);

    const url =
      SITE_URL + "work.html?id=" + id;

    const lastmod =
      validDate(work.updateDate) ||
      validDate(work.publishDate);

    entries.push(
      createUrlEntry(url, lastmod)
    );
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    ""
  ].join("\n");

  fs.writeFileSync(
    SITEMAP_PATH,
    xml,
    "utf8"
  );

  console.log(
    `作品詳細URL：${usedIds.size}件`
  );

  console.log(
    `サイトマップURL総数：${entries.length}件`
  );

  console.log("sitemap.xml生成完了！");
  console.log("==============================");
}

// --------------------------------------
// 実行
// --------------------------------------

try {
  generateSitemap();
} catch (error) {
  console.error(
    "SEOサイトマップ生成に失敗しました。"
  );

  console.error(error.message);

  process.exitCode = 1;
}
