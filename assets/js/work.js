// ==========================
// あたまのストレッチ プリント館
// work.js
// Version 2.5
// ==========================

// --------------------------
// URLからID取得
// --------------------------

const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));

// --------------------------
// 作品取得
// --------------------------

const work = works.find(item => item.id === id);

// --------------------------
// 表示エリア
// --------------------------

const area = document.getElementById("workArea");

// --------------------------
// ★表示
// --------------------------

function createStars(level){

    if(level===1) return "★☆☆";
    if(level===2) return "★★☆";
    if(level===3) return "★★★";

    return "";

}

// --------------------------
// パンくず生成
// --------------------------

function createBreadcrumb(work){

    let html = `

<div class="breadcrumb">

<a href="index.html">

ホーム

</a>

＞

<a href="library.html">

作品一覧

</a>

`;

    work.category.forEach(category=>{

        html += `

＞

<a href="library.html?category=${encodeURIComponent(category)}">

${category}

</a>

`;

    });

    work.fixedTags.forEach(tag=>{

        html += `

＞

<a href="library.html?category=${encodeURIComponent(work.category[0])}&tag=${encodeURIComponent(tag)}">

${tag}

</a>

`;

    });

    work.freeTags.forEach(tag=>{

        html += `

＞

<a href="library.html?category=${encodeURIComponent(work.category[0])}&tag=${encodeURIComponent(tag)}">

${tag}

</a>

`;

    });

    html += `

＞

<span>

${work.title}

</span>

</div>

`;

    return html;

}

// --------------------------
// 見つからない
// --------------------------

if(!work){

    area.innerHTML = `

<h2>

作品が見つかりませんでした。

</h2>

`;

}else{

    area.innerHTML = `

${createBreadcrumb(work)}

<h1>

${work.title}

</h1>

<p class="level">

${createStars(work.level)}

</p>
<p class="level">

${createStars(work.level)}

</p>

<div class="card-tags">

${work.category.map(category=>`

<a
class="tag"
href="library.html?category=${encodeURIComponent(category)}">

${category}

</a>

`).join("")}

</div>

<br>

<img
src="${work.thumbnail}"
class="work-image"
alt="${work.title}">

<div class="info-box">

<div class="info-item">

<b>対象</b>

<br>

${work.age}

</div>

<div class="info-item">

<b>サイズ</b>

<br>

${work.size}

</div>

<div class="info-item">

<b>道具</b>

<br>

${work.tools.join("・")}

</div>

</div>

<p class="work-description">

${work.description}

</p>

<h3 style="margin-top:30px;">

タグ

</h3>

<div class="card-tags">

${work.fixedTags.map(tag=>`

<a
class="tag"
href="library.html?category=${encodeURIComponent(work.category[0])}&tag=${encodeURIComponent(tag)}">

${tag}

</a>

`).join("")}

${work.freeTags.map(tag=>`

<a
class="tag"
href="library.html?category=${encodeURIComponent(work.category[0])}&tag=${encodeURIComponent(tag)}">

${tag}

</a>

`).join("")}

</div>

<div class="ad-box">

広告

</div>

<a
class="button download-button"
href="${work.pdf}"
target="_blank">

PDFをダウンロード

</a>

<hr style="margin:40px 0;">

<div id="seriesArea"></div>

<div id="relatedArea"></div>

<div id="moveArea"></div>

`;

}
// --------------------------
// シリーズ作品
// --------------------------

if(work){

    const seriesArea = document.getElementById("seriesArea");

    const seriesWorks = works.filter(item=>

        item.series === work.series &&
        item.id !== work.id

    );

    if(seriesWorks.length){

        seriesArea.innerHTML = `

<h2>

📚 同じシリーズ

</h2>

<div class="card-grid">

${seriesWorks.map(item=>`

<a
class="card"
href="work.html?id=${item.id}">

<img
src="${item.thumbnail}"
alt="${item.title}">

<div class="card-body">

<h3>

${item.title}

</h3>

<p>

${createStars(item.level)}

</p>

</div>

</a>

`).join("")}

</div>

`;

    }

}

// --------------------------
// 関連作品
// --------------------------

if(work){

    const relatedArea = document.getElementById("relatedArea");

    const relatedWorks = works.filter(item=>{

        if(item.id === work.id){

            return false;

        }

        const sameCategory = item.category.some(category=>

            work.category.includes(category)

        );

        const sameFixedTag = item.fixedTags.some(tag=>

            work.fixedTags.includes(tag)

        );

        const sameFreeTag = item.freeTags.some(tag=>

            work.freeTags.includes(tag)

        );

        return sameCategory ||

               sameFixedTag ||

               sameFreeTag;

    }).slice(0,4);

    if(relatedWorks.length){

        relatedArea.innerHTML = `

<h2 style="margin-top:50px;">

💡 関連作品

</h2>

<div class="card-grid">

${relatedWorks.map(item=>`

<a
class="card"
href="work.html?id=${item.id}">

<img
src="${item.thumbnail}"
alt="${item.title}">

<div class="card-body">

<h3>

${item.title}

</h3>

<p>

${createStars(item.level)}

</p>

</div>

</a>

`).join("")}

</div>

`;

    }

}
// --------------------------
// 前へ・次へ
// --------------------------

if(work){

    const moveArea = document.getElementById("moveArea");

    const index = works.findIndex(item=>

        item.id === work.id

    );

    const prev = works[index-1];

    const next = works[index+1];

    moveArea.innerHTML = `

<div
style="
display:flex;
justify-content:space-between;
align-items:center;
gap:15px;
margin-top:50px;
flex-wrap:wrap;
">

${prev ? `

<a
class="button"
href="work.html?id=${prev.id}">

⬅ 前の作品

</a>

` : "<div></div>"}

${next ? `

<a
class="button"
href="work.html?id=${next.id}">

次の作品 ➡

</a>

` : ""}

</div>

`;

}

// --------------------------
// タイトル変更
// --------------------------

if(work){

    document.title =
        `${work.title} | あたまのストレッチ プリント館`;

}

// --------------------------
// meta description変更
// --------------------------

if(work){

    const description = document.querySelector(

        'meta[name="description"]'

    );

    if(description){

        description.setAttribute(

            "content",

            `${work.title}｜${work.description}`

        );

    }

}
