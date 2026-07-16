// ==========================
// あたまのストレッチ プリント館
// library.js
// Version 2.7
// ==========================

const cardArea = document.getElementById("cardArea");
const countArea = document.getElementById("countArea");
const sortSelect = document.getElementById("sortSelect");
const breadcrumbArea = document.getElementById("breadcrumbArea");

// --------------------------
// URLパラメータ取得
// --------------------------

const params = new URLSearchParams(location.search);

const category = params.get("category");
const tag = params.get("tag");
const keyword = params.get("search");
const level = params.get("level");

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
// カード作成
// --------------------------

function createCard(work){

    return `
    <a href="work.html?id=${work.id}" class="card">

        <img
            src="${work.thumbnail}"
            alt="${work.title}"
        >

        <div class="card-body">

            <h3>${work.title}</h3>

            <p>${createStars(work.level)}</p>

        </div>

    </a>
    `;

}
// --------------------------
// パンくず生成
// --------------------------

function createBreadcrumb(){

    if(!breadcrumbArea) return;

    let html = `
        <a href="index.html">ホーム</a>
    `;

    let query = "";

    if(category){

        query = `category=${encodeURIComponent(category)}`;

        html += `
            ＞
            <a href="library.html?${query}">
                ${category}
            </a>
        `;
    }

    if(tag){

        query += `${query ? "&" : ""}tag=${encodeURIComponent(tag)}`;

        html += `
            ＞
            <a href="library.html?${query}">
                ${tag}
            </a>
        `;
    }

    if(keyword){

        query += `${query ? "&" : ""}search=${encodeURIComponent(keyword)}`;

        html += `
            ＞
            <span>
                「${keyword}」検索結果
            </span>
        `;
    }

    if(level){

        html += `
            ＞
            <span>
                難易度 ${createStars(Number(level))}
            </span>
        `;
    }

    if(!category && !tag && !keyword && !level){

        html += `
            ＞
            <span>作品一覧</span>
        `;
    }

    breadcrumbArea.innerHTML = html;

}
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

            work.fixedTags.includes(tag) ||

            work.freeTags.includes(tag)

        );

    }

    // --------------------------
    // キーワード検索
    // --------------------------

    if(keyword){

        const word = keyword.toLowerCase();

        result = result.filter(work=>{

            return(

                work.title.toLowerCase().includes(word)

                ||

                work.description.toLowerCase().includes(word)

                ||

                work.fixedTags.some(item=>

                    item.toLowerCase().includes(word)

                )

                ||

                work.freeTags.some(item=>

                    item.toLowerCase().includes(word)

                )

            );

        });

    }

    // --------------------------
    // 難易度検索（将来用）
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

        countArea.textContent = `作品${result.length}件`;

    }

    // --------------------------
    // 検索結果0件
    // --------------------------

    if(result.length === 0){

        cardArea.innerHTML = `

            <div class="no-result">

                <h2>🔍 検索結果がありません</h2>

                <p>

                    条件を変えて検索してみてください😊

                </p>

            </div>

        `;

        return;

    }

    // --------------------------
    // カード表示
    // --------------------------

    cardArea.innerHTML = result
        .map(work=>createCard(work))
        .join("");

}

// --------------------------
// 初回表示
// --------------------------

loadWorks();

// --------------------------
// 並び替え変更
// --------------------------

if(sortSelect){

    sortSelect.addEventListener("change",loadWorks);

}
