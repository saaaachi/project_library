// ==========================
// Project Library
// work.js
// Version 5.0
// ==========================

// --------------------------
// URL取得
// --------------------------

const params =
    new URLSearchParams(location.search);

const id =
    Number(params.get("id"));

// --------------------------
// 表示エリア
// --------------------------

const area =
    document.getElementById("workArea");

// --------------------------
// データ取得
// --------------------------

const work =
    works.find(item=>item.id===id);

// --------------------------
// ★表示
// --------------------------

function createStars(level){

    switch(level){

        case 1:
            return "★☆☆";

        case 2:
            return "★★☆";

        case 3:
            return "★★★";

        default:
            return "";

    }

}

// --------------------------
// NEW表示
// --------------------------

function createNewBadge(work){

    if(!work.isNew){

        return "";

    }

    return `

<span class="badge badge-new">

NEW

</span>

`;

}

// --------------------------
// おすすめ表示
// --------------------------

function createRecommendBadge(work){

    if(!work.recommend){

        return "";

    }

    return `

<span class="badge badge-recommend">

おすすめ

</span>

`;

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

    html += `

＞

<span class="current">

${work.title}

</span>

</div>

`;

    return html;

}
// --------------------------
// 見つからない場合
// --------------------------

if(!work){

    area.innerHTML = `

<section class="container">

<h2>

作品が見つかりませんでした。

</h2>

<p>

URLをご確認ください。

</p>

<a
class="button"
href="library.html">

作品一覧へ戻る

</a>

</section>

`;

}else{

// --------------------------
// メイン表示
// --------------------------

area.innerHTML = `

<section class="container">

${createBreadcrumb(work)}

${createNewBadge(work)}
${createRecommendBadge(work)}

<h1 class="section-title">

${work.title}

</h1>

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

<div class="work-image">

<img
src="${work.thumbnail}"
alt="${work.title}">

</div>

<div class="info-box">

<div class="info-item">

<b>対象年齢</b>

<br>

${work.age}

</div>

<div class="info-item">

<b>印刷サイズ</b>

<br>

${work.size}

</div>

<div class="info-item">

<b>必要な道具</b>

<br>

${work.tools.join("・")}

</div>

</div>

<div class="work-description">

${work.description}

</div>

<h3>

タグ

</h3>

<div class="card-tags">

${work.fixedTags.map(tag=>`

<a
class="tag"
href="library.html?tag=${encodeURIComponent(tag)}">

${tag}

</a>

`).join("")}

${work.freeTags.map(tag=>`

<a
class="tag"
href="library.html?tag=${encodeURIComponent(tag)}">

${tag}

</a>

`).join("")}

</div>

<div class="ad-box">

広告エリア

</div>

<a
class="button download-button"
href="${work.pdf}"
target="_blank">

PDFをダウンロード

</a>

<div class="section">

<h3>

ご利用について

</h3>

<p>

個人・教育・施設利用は無料です。<br>
再配布・販売・データの転載は禁止しています。

</p>

</div>

<div id="seriesArea"></div>

<div id="relatedArea"></div>

<div id="moveArea"></div>

</section>

`;

}
// --------------------------
// シリーズ作品
// --------------------------

if(work){

    const seriesArea =
        document.getElementById("seriesArea");

    const seriesWorks =
        works.filter(item=>

            item.series === work.series &&

            item.id !== work.id

        );

    if(seriesWorks.length){

        seriesArea.innerHTML = `

<h2 class="section-title">

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

${createNewBadge(item)}

${createRecommendBadge(item)}

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

    const relatedArea =
        document.getElementById("relatedArea");

    const relatedWorks =
        works.filter(item=>{

            if(item.id === work.id){

                return false;

            }

            const sameCategory =
                item.category.some(category=>

                    work.category.includes(category)

                );

            const sameFixedTag =
                item.fixedTags.some(tag=>

                    work.fixedTags.includes(tag)

                );

            const sameFreeTag =
                item.freeTags.some(tag=>

                    work.freeTags.includes(tag)

                );

            return (

                sameCategory ||

                sameFixedTag ||

                sameFreeTag

            );

        }).slice(0,4);

    if(relatedWorks.length){

        relatedArea.innerHTML = `

<h2 class="section-title">

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

${createNewBadge(item)}

${createRecommendBadge(item)}

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

    const moveArea =
        document.getElementById("moveArea");

    const index =
        works.findIndex(item=>item.id===work.id);

    const prev =
        works[index-1];

    const next =
        works[index+1];

    moveArea.innerHTML = `

<div
class="section"
style="
display:flex;
justify-content:space-between;
align-items:center;
flex-wrap:wrap;
gap:15px;
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

次の作品 ➜

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

`${work.title} | Project Library`;

}

// --------------------------
// meta description
// --------------------------

if(work){

    const description =

        document.querySelector(

            'meta[name="description"]'

        );

    if(description){

        description.setAttribute(

            "content",

`${work.title}｜${work.description}`

        );

    }

}

// --------------------------
// 公開日表示（将来用）
// --------------------------

if(work){

    console.log(

        "公開日 :", work.publishDate

    );

    console.log(

        "更新日 :", work.updateDate

    );

}

// --------------------------
// Version表示
// --------------------------

console.log(

"Project Library work.js Version5.0"

);
