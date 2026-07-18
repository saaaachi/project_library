// ==========================
// Project Library
// library.js
// Version 3.0
// ==========================

// --------------------------
// 要素取得
// --------------------------

const cardArea =
    document.getElementById("cardArea");

const countArea =
    document.getElementById("countArea");

const sortSelect =
    document.getElementById("sortSelect");

const breadcrumbArea =
    document.getElementById("breadcrumbArea");

// --------------------------
// URLパラメータ
// --------------------------

const params =
    new URLSearchParams(location.search);

const category =
    params.get("category");

const tag =
    params.get("tag");

const keyword =
    params.get("search");

const level =
    params.get("level");

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
// バッジ生成
// --------------------------

function createBadge(work){

    let badge = "";

    if(work.isNew){

        badge += `
        <span class="badge badge-new">
            NEW
        </span>
        `;

    }

    if(work.recommend){

        badge += `
        <span class="badge badge-recommend">
            おすすめ
        </span>
        `;

    }

    return badge;

}

// --------------------------
// カード生成
// --------------------------

function createCard(work){

    return `

<a
href="work.html?id=${work.id}"
class="card"
>

    <img
        src="${work.thumbnail}"
        alt="${work.title}"
    >

    <div class="card-body">

        ${createBadge(work)}

        <h3>

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
// パンくず生成
// --------------------------

function createBreadcrumb(){

    if(!breadcrumbArea){

        return;

    }

    let html = `
<a href="index.html">

ホーム

</a>
`;

    let query = "";

    // --------------------------
    // カテゴリ
    // --------------------------

    if(category){

        query =
            `category=${encodeURIComponent(category)}`;

        html += `

＞

<a href="library.html?${query}">

${category}

</a>

`;

    }

    // --------------------------
    // タグ
    // --------------------------

    if(tag){

        query +=
            `${query ? "&" : ""}tag=${encodeURIComponent(tag)}`;

        html += `

＞

<a href="library.html?${query}">

${tag}

</a>

`;

    }

    // --------------------------
    // キーワード
    // --------------------------

    if(keyword){

        html += `

＞

<span>

「${keyword}」検索結果

</span>

`;

    }

    // --------------------------
    // 難易度
    // --------------------------

    if(level){

        html += `

＞

<span>

難易度 ${createStars(Number(level))}

</span>

`;

    }

    // --------------------------
    // 通常表示
    // --------------------------

    if(
        !category &&
        !tag &&
        !keyword &&
        !level
    ){

        html += `

＞

<span>

作品一覧

</span>

`;

    }

    breadcrumbArea.innerHTML = html;

}

// --------------------------
// 作品読み込み
// --------------------------

function loadWorks(){

    createBreadcrumb();

    let result = [...works];

    // --------------------------
    // カテゴリ検索
    // --------------------------

    if(category){

        result = result.filter(work=>

            work.category.includes(category)

        );

    }

    // --------------------------
    // タグ検索
    // --------------------------

    if(tag){

        result = result.filter(work=>

            work.fixedTags.includes(tag)

            ||

            work.freeTags.includes(tag)

        );

    }

    // --------------------------
    // キーワード検索
    // --------------------------

    if(keyword){

        const word =
            keyword.toLowerCase();

        result = result.filter(work=>{

            return(

                work.title
                    .toLowerCase()
                    .includes(word)

                ||

                work.description
                    .toLowerCase()
                    .includes(word)

                ||

                work.fixedTags.some(item=>

                    item
                        .toLowerCase()
                        .includes(word)

                )

                ||

                work.freeTags.some(item=>

                    item
                        .toLowerCase()
                        .includes(word)

                )

            );

        });

    }

    // --------------------------
    // 難易度検索
    // --------------------------

    if(level){

        result = result.filter(work=>

            work.level === Number(level)

        );

    }
        // --------------------------
    // 並び替え
    // --------------------------

    if(sortSelect){

        switch(sortSelect.value){

            case "old":

                result.sort((a,b)=>

                    new Date(a.publishDate) -
                    new Date(b.publishDate)

                );

                break;

            case "easy":

                result.sort((a,b)=>

                    a.level - b.level

                );

                break;

            case "hard":

                result.sort((a,b)=>

                    b.level - a.level

                );

                break;

            default:

                result.sort((a,b)=>

                    new Date(b.publishDate) -
                    new Date(a.publishDate)

                );

                break;

        }

    }

    // --------------------------
    // 件数表示
    // --------------------------

    if(countArea){

        countArea.textContent =

            `作品 ${result.length} 件`;

    }

    // --------------------------
    // 検索結果なし
    // --------------------------

    if(result.length === 0){

        cardArea.innerHTML = `

<div class="no-result">

    <h2>

        🔍 検索結果がありません

    </h2>

    <p>

        条件を変えて検索してみてください😊

    </p>

</div>

`;

        return;

    }

    // --------------------------
    // カード生成
    // --------------------------

    let html = "";

    result.forEach(work=>{

        html += createCard(work);

    });

    cardArea.innerHTML = html;

}
// --------------------------
// 初回表示
// --------------------------

loadWorks();

// --------------------------
// 並び替え変更
// --------------------------

if(sortSelect){

    sortSelect.addEventListener(

        "change",

        function(){

            loadWorks();

        }

    );

}

// --------------------------
// Version表示
// --------------------------

console.log(

    "Project Library library.js Version3.0"

);
