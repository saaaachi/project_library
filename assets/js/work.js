// ==========================
// Project Library
// work.js
// Version 1.0
// ==========================

// URLからID取得
const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));

// 該当作品取得
const work = works.find(item => item.id === id);

// 表示エリア
const area = document.getElementById("workArea");

if (!work) {

    area.innerHTML = `
        <h2>作品が見つかりませんでした。</h2>
    `;

} else {

    area.innerHTML = `

<h1>${work.title}</h1>

<p class="level">${createStars(work.level)}</p>

<img src="${work.thumbnail}" alt="${work.title}">

<div class="info-box">

<div class="info-item">
<b>対象</b><br>
${work.age}
</div>

<div class="info-item">
<b>サイズ</b><br>
${work.size}
</div>

<div class="info-item">
<b>道具</b><br>
${work.tools.join("・")}
</div>

</div>

<p>${work.description}</p>

<div class="card-tags">

${work.freeTags.map(tag=>`
<span class="tag">${tag}</span>
`).join("")}

</div>

<br>

<a
class="button download-button"
href="${work.pdf}"
target="_blank">

PDFをダウンロード

</a>

`;

}

// ----------------------------
// ★表示
// ----------------------------

function createStars(level){

    if(level===1) return "★☆☆";

    if(level===2) return "★★☆";

    if(level===3) return "★★★";

    return "";

}
