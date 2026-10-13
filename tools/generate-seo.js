
/* ======================================
   Project Library
   SEO Generator
   Version 1.1
   ======================================

   機能：
   ・works.js読み込み
   ・作品別HTML生成
   ・SEO title / description
   ・canonical / OGP
   ・sitemap.xml生成
   ・削除作品のHTML整理

   注意：
   生成HTMLは現在テスト段階。
   本番サイトへの公開は
   GitHub Actions連携後に行う。

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

const OUTPUT_DIR = path.join(
    ROOT,
    "works"
);

const SITEMAP_PATH = path.join(
    ROOT,
    "sitemap.xml"
);

// --------------------------------------
// HTML特殊文字
// --------------------------------------

function escapeHtml(value){

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}

// --------------------------------------
// XML特殊文字
// --------------------------------------

function escapeXml(value){

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

}

// --------------------------------------
// 配列化
// --------------------------------------

function toArray(value){

    if(Array.isArray(value)){
        return value.filter(item =>
            item !== null &&
            item !== undefined &&
            String(item).trim() !== ""
        );
    }

    if(
        value === null ||
        value === undefined ||
        value === ""
    ){
        return [];
    }

    return [value];

}

// --------------------------------------
// 日付確認
// --------------------------------------

function validDate(value){

    if(typeof value !== "string"){
        return "";
    }

    const date = value.trim();

    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){
        return "";
    }

    const parsed = new Date(
        date + "T00:00:00Z"
    );

    if(
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0,10) !== date
    ){
        return "";
    }

    return date;

}

// --------------------------------------
// works.js読み込み
// --------------------------------------

function loadWorks(){

    if(!fs.existsSync(WORKS_PATH)){
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

    const start = source.indexOf(
        startMarker
    );

    const end = source.indexOf(
        endMarker
    );

    if(
        start === -1 ||
        end === -1 ||
        end <= start
    ){
        throw new Error(
            "works.jsの配列構造を確認できません。"
        );
    }

    const expression = source
        .slice(
            start + startMarker.length,
            end
        )
        .trim()
        .replace(/;\s*$/, "");

    const result = vm.runInNewContext(
        expression,
        Object.create(null),
        { timeout: 5000 }
    );

    if(!Array.isArray(result)){
        throw new Error(
            "作品データが配列ではありません。"
        );
    }

    return result;

}

// --------------------------------------
// 作品データの検証
// --------------------------------------

function validateWorks(works){

    const ids = new Set();

    for(const work of works){

        const id = work.id;

        if(
            !Number.isSafeInteger(id) ||
            id <= 0
        ){
            throw new Error(
                `不正な作品ID：${id}`
            );
        }

        if(ids.has(id)){
            throw new Error(
                `作品IDが重複しています：${id}`
            );
        }

        ids.add(id);

        for(const field of [
            "thumbnail",
            "pdf"
        ]){

            const value = work[field];

            const prefix =
                field === "pdf"
                    ? "assets/pdf/"
                    : "assets/images/thumbnail/";

            if(
                typeof value !== "string" ||
                !value.startsWith(prefix) ||
                value.includes("..") ||
                value.includes("\\") ||
                /[?#]/.test(value)
            ){
                throw new Error(
                    `作品${id}の${field}パスが不正です。`
                );
            }

        }

    }

}

// --------------------------------------
// URL生成
// --------------------------------------

function getWorkUrl(id){

    return SITE_URL +
        "works/" +
        id +
        ".html";

}

// --------------------------------------
// SEO説明文
// --------------------------------------

function createDescription(work){

    const title = String(
        work.title ?? ""
    ).trim();

    const description = String(
        work.description ?? ""
    )
        .replace(/\s+/g, " ")
        .trim();

    const categories = toArray(
        work.category
    ).join("・");

    const combined = [
        title,
        description,
        categories
            ? `対象：${categories}`
            : "",
        "無料PDFプリントを公開しています。"
    ]
        .filter(Boolean)
        .join("｜");

    return combined.slice(0,160);

}

// --------------------------------------
// 安全なサイト内パス
// --------------------------------------

function encodeAssetPath(value){

    return String(value)
        .split("/")
        .map(encodeURIComponent)
        .join("/");

}

// --------------------------------------
// タグ表示
// --------------------------------------

function createTags(tags){

    return toArray(tags)
        .map(tag => {

            const text = escapeHtml(tag);

            const query =
                encodeURIComponent(
                    String(tag)
                );

            return `
<a
class="tag"
href="../library.html?tag=${query}">
${text}
</a>`;

        })
        .join("\n");

}

// --------------------------------------
// カテゴリ表示
// --------------------------------------

function createCategories(categories){

    return toArray(categories)
        .map(category => {

            const text = escapeHtml(
                category
            );

            const query =
                encodeURIComponent(
                    String(category)
                );

            return `
<a
class="tag"
href="../library.html?category=${query}">
${text}
</a>`;

        })
        .join("\n");

}

// --------------------------------------
// 作品HTML生成
// --------------------------------------

function createWorkHtml(work){

    const id = work.id;

    const title = String(
        work.title ?? ""
    ).trim();

    const pageTitle =
        `${title} | Project Library`;

    const description =
        createDescription(work);

    const canonical =
        getWorkUrl(id);

    const thumbnailPath =
        encodeAssetPath(
            work.thumbnail
        );

    const pdfPath =
        encodeAssetPath(
            work.pdf
        );

    const thumbnailUrl =
        SITE_URL + thumbnailPath;

    const categories =
        createCategories(
            work.category
        );

    const tags =
        createTags([
            ...toArray(work.fixedTags),
            ...toArray(work.freeTags)
        ]);

    const tools =
        toArray(work.tools)
            .map(escapeHtml)
            .join("・");

    const stars = {
        1: "★☆☆",
        2: "★★☆",
        3: "★★★"
    }[Number(work.level)] || "";

    const contentDescription =
        escapeHtml(
            work.description ?? ""
        );

    const updateDate =
        validDate(work.updateDate) ||
        validDate(work.publishDate);

    return `<!DOCTYPE html>
<html lang="ja">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
>

<title>${escapeHtml(pageTitle)}</title>

<meta
name="description"
content="${escapeHtml(description)}"
>

<link
rel="canonical"
href="${escapeHtml(canonical)}"
>

<meta property="og:type" content="article">

<meta
property="og:title"
content="${escapeHtml(pageTitle)}"
>

<meta
property="og:description"
content="${escapeHtml(description)}"
>

<meta
property="og:image"
content="${escapeHtml(thumbnailUrl)}"
>

<meta
property="og:url"
content="${escapeHtml(canonical)}"
>

<meta
property="og:site_name"
content="Project Library"
>

<meta
name="twitter:card"
content="summary_large_image"
>

<link
rel="stylesheet"
href="../assets/css/style.css"
>

</head>

<body>

<div class="container">

<main>

<section class="container">

<div class="breadcrumb">

<a href="../index.html">ホーム</a>
 ＞
<a href="../library.html">作品一覧</a>
 ＞
<span class="current">
${escapeHtml(title)}
</span>

</div>

<h1 class="section-title">
${escapeHtml(title)}
</h1>

<p class="level">
${stars}
</p>

<div class="card-tags">
${categories}
</div>

<div class="work-image">

<img
src="../${escapeHtml(thumbnailPath)}"
alt="${escapeHtml(title)}"
>

</div>

<div class="info-box">

<div class="info-item">
<b>対象年齢</b>
<p>${escapeHtml(work.age ?? "")}</p>
</div>

<div class="info-item">
<b>印刷サイズ</b>
<p>${escapeHtml(work.size ?? "")}</p>
</div>

<div class="info-item">
<b>必要な道具</b>
<p>${tools}</p>
</div>

</div>

<div
class="work-description"
style="white-space:pre-wrap;"
>${contentDescription}</div>

<h3>タグ</h3>

<div class="card-tags">
${tags || "<p>タグはありません。</p>"}
</div>

<div class="section">

<a
class="button"
href="../${escapeHtml(pdfPath)}"
target="_blank"
rel="noopener"
>
📄 PDFを開く
</a>

<p style="font-size:13px;color:#777;">
PDFを開いて保存できます。
</p>

</div>

<div class="section">

<h3>ご利用について</h3>

<p>
個人・教育・施設利用は無料です。
再配布・販売は禁止しています。
</p>

</div>

<div class="section">

<a
class="button"
href="../work.html?id=${id}"
>
通常の作品ページを開く
</a>

<p style="font-size:13px;color:#777;">
現在のダウンロード機能や
関連作品表示を利用できます。
</p>

</div>

<div class="section">

<a href="../library.html">
作品一覧へ戻る
</a>

</div>

</section>

</main>

</div>

<!-- 更新日：${updateDate} -->
<!-- SEO Generator Version 1.1 -->

</body>
</html>
`;

}

// --------------------------------------
// 作品HTML書き込み
// --------------------------------------

function generateWorkPages(works){

    fs.mkdirSync(
        OUTPUT_DIR,
        { recursive: true }
    );

    const activeFiles = new Set();

    for(const work of works){

        const filename =
            `${work.id}.html`;

        const filePath = path.join(
            OUTPUT_DIR,
            filename
        );

        const html =
            createWorkHtml(work);

        fs.writeFileSync(
            filePath,
            html,
            "utf8"
        );

        activeFiles.add(filename);

    }

    // ----------------------------------
    // 削除済み作品のHTML整理
    // ----------------------------------

    const files = fs.readdirSync(
        OUTPUT_DIR
    );

    for(const filename of files){

        // 数字.html形式だけ管理対象
        if(!/^\d+\.html$/.test(filename)){
            continue;
        }

        if(activeFiles.has(filename)){
            continue;
        }

        const filePath = path.join(
            OUTPUT_DIR,
            filename
        );

        fs.unlinkSync(filePath);

        console.log(
            `削除済みSEOページ整理：${filename}`
        );

    }

    return activeFiles.size;

}

// --------------------------------------
// sitemap URL要素
// --------------------------------------

function createUrlEntry(url,lastmod=""){

    const lines = [
        "  <url>",
        `    <loc>${escapeXml(url)}</loc>`
    ];

    if(lastmod){

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

function generateSitemap(works){

    const entries = [];

    entries.push(
        createUrlEntry(SITE_URL)
    );

    entries.push(
        createUrlEntry(
            SITE_URL + "library.html"
        )
    );

    for(const work of works){

        const lastmod =
            validDate(work.updateDate) ||
            validDate(work.publishDate);

        entries.push(
            createUrlEntry(
                getWorkUrl(work.id),
                lastmod
            )
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

    return entries.length;

}

// --------------------------------------
// メイン処理
// --------------------------------------

function main(){

    console.log("==============================");
    console.log("Project Library SEO Generator");
    console.log("Version 1.1");
    console.log("==============================");

    const works = loadWorks();

    validateWorks(works);

    console.log(
        `登録作品数：${works.length}件`
    );

    const pageCount =
        generateWorkPages(works);

    const sitemapCount =
        generateSitemap(works);

    console.log(
        `生成HTML：${pageCount}件`
    );

    console.log(
        `サイトマップURL総数：${sitemapCount}件`
    );

    console.log(
        "SEO生成処理が完了しました！"
    );

    console.log("==============================");

}

// --------------------------------------
// 実行
// --------------------------------------

try{

    main();

}catch(error){

    console.error(
        "SEO生成処理に失敗しました。"
    );

    console.error(error);

    process.exitCode = 1;

}
