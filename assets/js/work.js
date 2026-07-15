// ==========================
// あたまのストレッチ プリント館
// work.js
// Version 2.4
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
// 見つからない
// --------------------------

if(!work){

    area.innerHTML = `
        <h2>作品が見つかりませんでした。</h2>
    `;

}else{

    area.innerHTML = `

<div class="breadcrumb">

    <a href="index.html">
        ホーム
    </a>

    ＞

    <a href="library.html">
        作品一覧
    </a>

    ＞

    <span>
        ${work.title}
    </span>

</div>

<h1>

    ${work.title}

</h1>

<p class="level">

    ${createStars(work.level)}

</p>

<div class="card-tags">

    <a
        class="tag"
        href="library.html?category=${encodeURIComponent(work.category[0])}">

        ${work.category[0]}

    </a>

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

<div class="card-tags">

${work.freeTags.map(tag=>`

<a
class="tag"
href="library.html?tag=${encodeURIComponent(tag)}">

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
// ★表示
// --------------------------

function createStars(level){

    if(level===1) return "★☆☆";

    if(level===2) return "★★☆";

    if(level===3) return "★★★";

    return "";

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

<h2>📚 同じシリーズ</h2>

<div class="card-grid">

${seriesWorks.map(item=>`

<a
class="card"
href="work.html?id=${item.id}">

<img
src="${item.thumbnail}"
alt="${item.title}">

<div class="card-body">

<h3>${item.title}</h3>

<p>${createStars(item.level)}</p>

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

        if(item.id === work.id) return false;

        const sameCategory =
            item.category.some(cat=>
                work.category.includes(cat)
            );

        const sameTag =
            item.freeTags.some(tag=>
                work.freeTags.includes(tag)
            );

        return sameCategory || sameTag;

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

<h3>${item.title}</h3>

<p>${createStars(item.level)}</p>

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
margin-top:50px;
gap:15px;
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
