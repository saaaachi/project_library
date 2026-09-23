// ==========================
// Project Library
// library.js
// Version 5.0
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
// 広告生成
// --------------------------

function createLibraryAd(){

    return `

<div
    class="library-inline-ad"
    style="
        width:100%;
        max-height:100px;
        overflow:hidden;
        margin:18px 0;
    "
>

    <ins
        class="adsbygoogle"
        style="
            display:block;
            width:100%;
        "
        data-ad-client="ca-pub-1299640300068792"
        data-ad-slot="6020574861"
        data-ad-format="auto"
        data-full-width-responsive="true"
    ></ins>

</div>

`;

}


// --------------------------
// 広告間隔
// --------------------------

function getAdInterval(){

    // スマートフォン
    if(window.innerWidth <= 767){

        return 6;

    }

    // PC・タブレット
    return 12;

}


// --------------------------
// 広告を表示するか
// --------------------------

function shouldInsertAd(index, total){

    const interval =
        getAdInterval();

    const position =
        index + 1;

    // 作品数が広告間隔未満なら広告なし
    if(total < interval){

        return false;

    }

    // 一定件数ごとに広告
    if(position % interval === 0){

        return true;

    }

    return false;

}


// =====================================================
// パンくず用 件数取得
// =====================================================

function getCategoryCount(categoryName){

    if(!categoryName){

        return 0;

    }

    return works.filter(work => {

        return(
            Array.isArray(work.category) &&
            work.category.includes(categoryName)
        );

    }).length;

}


function getTagCount(tagName, categoryName = null){

    if(!tagName){

        return 0;

    }

    return works.filter(work => {

        // カテゴリ指定がある場合
        if(categoryName){

            if(
                !Array.isArray(work.category) ||
                !work.category.includes(categoryName)
            ){

                return false;

            }

        }

        const fixedTags =
            Array.isArray(work.fixedTags)
                ? work.fixedTags
                : [];

        const freeTags =
            Array.isArray(work.freeTags)
                ? work.freeTags
                : [];

        return(
            fixedTags.includes(tagName) ||
            freeTags.includes(tagName)
        );

    }).length;

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

        const categoryCount =
            getCategoryCount(category);

        query =
            `category=${encodeURIComponent(category)}`;

        html += `

＞

<a href="library.html?${query}">

${category} (${categoryCount})

</a>

`;

    }


    // --------------------------
    // タグ
    // --------------------------

    if(tag){

        const tagCount =
            getTagCount(
                tag,
                category
            );

        query +=
            `${query ? "&" : ""}tag=${encodeURIComponent(tag)}`;

        html += `

＞

<a href="library.html?${query}">

${tag} (${tagCount})

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
// AdSense広告を実行
// --------------------------

function pushAds(){

    const ads =
        cardArea.querySelectorAll(
            ".library-inline-ad .adsbygoogle"
        );

    ads.forEach(ad => {

        try{

            if(
                !ad.getAttribute(
                    "data-adsbygoogle-status"
                )
            ){

                (adsbygoogle =
                    window.adsbygoogle || []
                ).push({});

            }

        }catch(error){

            console.log(
                "AdSense広告の読み込みを待機しています。",
                error
            );

        }

    });

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

        result = result.filter(work =>

            work.category.includes(category)

        );

    }


    // --------------------------
    // タグ検索
    // --------------------------

    if(tag){

        result = result.filter(work =>

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

        result = result.filter(work => {

            return(

                work.title
                    .toLowerCase()
                    .includes(word)

                ||

                work.description
                    .toLowerCase()
                    .includes(word)

                ||

                work.fixedTags.some(item =>

                    item
                        .toLowerCase()
                        .includes(word)

                )

                ||

                work.freeTags.some(item =>

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

        result = result.filter(work =>

            work.level === Number(level)

        );

    }


    // --------------------------
    // 並び替え
    // --------------------------

    if(sortSelect){

        switch(sortSelect.value){

            case "old":

                result.sort((a,b) =>

                    new Date(a.publishDate) -
                    new Date(b.publishDate)

                );

                break;


            case "easy":

                result.sort((a,b) =>

                    a.level - b.level

                );

                break;


            case "hard":

                result.sort((a,b) =>

                    b.level - a.level

                );

                break;


            default:

                result.sort((a,b) =>

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


    result.forEach((work,index) => {

        // 作品カード
        html += createCard(work);


        // --------------------------
        // 広告挿入
        // --------------------------

        if(
            shouldInsertAd(
                index,
                result.length
            )
        ){

            html += createLibraryAd();

        }

    });


    // --------------------------
    // HTML反映
    // --------------------------

    cardArea.innerHTML = html;


    // --------------------------
    // AdSense実行
    // --------------------------

    pushAds();

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

    "Project Library library.js Version5.0"

);