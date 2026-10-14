
/* ======================================
   Project Library
   SEO Generator
   Version 1.2
   ======================================

   ・作品別HTML生成
   ・SEO情報自動設定
   ・既存work.js v5.7連携
   ・sitemap.xml生成
   ・削除作品のHTML整理

   実行：
   node tools/generate-seo.js

   注意：
   GitHub Actionsテスト中は
   本番サイトに自動公開しない。

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
// 作品データ検証
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

    return [
        title,
        description,
        categories
            ? `対象：${categories}`
            : "",
        "無料PDFプリントを公開しています。"
    ]
        .filter(Boolean)
        .join("｜")
        .slice(0,160);

}

// --------------------------------------
// サイト内パス
// --------------------------------------

function encodeAssetPath(value){

    return String(value)
        .split("/")
        .map(encodeURIComponent)
        .join("/");

}

// --------------------------------------
// カテゴリリンク
// --------------------------------------

function createCategories(categories){

    return toArray(categories)
        .map(category => {

            const text = escapeHtml(category);

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
// タグリンク
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
href="../library.html?tag=${query}"
data-project-library-tag="${text}">
${text}
</a>`;

        })
        .join("\n");

}

// --------------------------------------
// バッジ
// --------------------------------------

function createBadges(work){

    let html = "";

    if(work.isNew){
        html += `
<span class="badge badge-new">
NEW
</span>`;
    }

    if(work.recommend){
        html += `
<span class="badge badge-recommend">
おすすめ
</span>`;
    }

    return html;

}

// --------------------------------------
// 広告HTML
// --------------------------------------

function createWorkAd100(){

    return `
<div class="work-ad-100">
<ins
class="adsbygoogle"
style="display:inline-block;width:728px;height:100px"
data-ad-client="ca-pub-1299640300068792"
data-ad-slot="5209302442">
</ins>
</div>`;

}

// --------------------------------------
// 広告CSS
// --------------------------------------

function createAdStyle(){

    return `
<style>
.work-ad-100{
    width:100%;
    min-height:100px;
    display:flex;
    justify-content:center;
    align-items:center;
    overflow:hidden;
    margin:20px 0;
}
.work-ad-100 .adsbygoogle{
    display:inline-block;
    width:728px;
    height:100px;
    max-width:100%;
}
@media screen and (max-width:767px){
    .work-ad-100{
        width:100%;
        min-height:100px;
        overflow:hidden;
    }
    .work-ad-100 .adsbygoogle{
        width:100% !important;
        max-width:100% !important;
        height:100px !important;
    }
}
</style>`;

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

${createAdStyle()}

<script
async
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1299640300068792"
crossorigin="anonymous">
</script>

</head>

<body>

<header id="header"></header>

<div class="container">

<aside id="sidebar"></aside>

<main>

<div id="workArea">

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

${createBadges(work)}

<h1 class="section-title">
${escapeHtml(title)}
</h1>

<p class="level">
${stars}
</p>

<!-- タイトル下広告 -->
${createWorkAd100()}

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
<b>対象年齢</b><br>
${escapeHtml(work.age ?? "")}
</div>

<div class="info-item">
<b>印刷サイズ</b><br>
${escapeHtml(work.size ?? "")}
</div>

<div class="info-item">
<b>必要な道具</b><br>
${tools}
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

<!-- PDFダウンロード -->

<button
type="button"
class="button download-button"
id="pdfDownloadButton"
aria-label="${escapeHtml(title)}のPDFをダウンロード">
📄 PDFをダウンロード
</button>

<p
id="pdfDownloadHelp"
style="font-size:13px;color:#777;margin-top:8px;">
iPhoneでは「ファイルに保存」を選択できます。
</p>

<!-- ダウンロード下広告 -->
${createWorkAd100()}

<div class="section">

<h3>ご利用について</h3>

<p>
個人・教育・施設利用は無料です。<br>
再配布・販売・データの転載は禁止しています。
</p>

</div>

<div id="seriesArea"></div>
<div id="relatedArea"></div>
<div id="moveArea"></div>

</section>

</div>

</main>

</div>

<footer id="footer"></footer>

<script src="../assets/data/works.js"></script>
<script src="../assets/js/common.js"></script>
<script src="../assets/js/work.js"></script>

<!-- 更新日：${updateDate} -->
<!-- SEO Generator Version 1.2 -->

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
    // 削除済み作品HTML整理
    // ----------------------------------

    const files = fs.readdirSync(
        OUTPUT_DIR
    );

    for(const filename of files){

        if(!/^\d+\.html$/.test(filename)){
            continue;
        }

        if(activeFiles.has(filename)){
            continue;
        }

        fs.unlinkSync(
            path.join(
                OUTPUT_DIR,
                filename
            )
        );

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
    console.log("Version 1.2");
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
