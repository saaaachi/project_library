// ==========================
// あたまのストレッチ プリント館
// index.js
// Version 1.0
// ==========================

// --------------------------
// 表示エリア
// --------------------------

const newArea = document.getElementById("newArea");
const recommendArea = document.getElementById("recommendArea");

// --------------------------
// ★表示
// --------------------------

function createStars(level){

    if(level === 1) return "★☆☆";
    if(level === 2) return "★★☆";
    if(level === 3) return "★★★";

    return "";

}

// --------------------------
// カード生成
// --------------------------

function createCard(work){

    return `

<a href="work.html?id=${work.id}" class="card">

<img
src="${work.thumbnail}"
alt="${work.title}">

<div class="card-body">

<h3 class="card-title">

${work.isNew ? '<span class="badge badge-new">NEW</span>' : ""}

${work.recommend ? '<span class="badge badge-recommend">おすすめ</span>' : ""}

${work.title}

</h3>

<p class="card-level">

${createStars(work.level)}

</p>

</div>

</a>

`;

}

// --------------------------
// NEW作品
// --------------------------

function loadNewWorks(){

    if(!newArea) return;

    const newWorks = works
        .filter(work => work.isNew)
        .slice(0,2);

    newArea.innerHTML = newWorks
        .map(createCard)
        .join("");

}

// --------------------------
// おすすめ作品
// --------------------------

function loadRecommendWorks(){

    if(!recommendArea) return;

    const recommendWorks = works
        .filter(work => work.recommend);

    recommendArea.innerHTML = recommendWorks
        .map(createCard)
        .join("");

}

// --------------------------
// 初期表示
// --------------------------

loadNewWorks();

loadRecommendWorks();
