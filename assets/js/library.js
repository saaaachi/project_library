// ==========================
// あたまのストレッチ プリント館
// library.js
// Version 2.6
// ==========================

const cardArea = document.getElementById("cardArea");
const countArea = document.getElementById("countArea");
const sortSelect = document.getElementById("sortSelect");
const breadcrumbArea = document.getElementById("breadcrumbArea");

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

    const params = new URLSearchParams(location.search);

    const category = params.get("category");
    const tag = params.get("tag");
    const keyword = params.get("search");

    let html = `
        <a href="index.html">ホーム</a>
    `;

    if(category){

        html += `
            ＞
            <a href="library.html?category=${encodeURIComponent(category)}">
                ${category}
            </a>
        `;

    }

    if(tag){

        const url = category
            ? `library.html?category=${encodeURIComponent(category)}&tag=${encodeURIComponent(tag)}`
            : `library.html?tag=${encodeURIComponent(tag)}`;

        html += `
            ＞
            <a href="${url}">
                ${tag}
            </a>
        `;

    }

    if(keyword){

        html += `
            ＞
            <span>
                「${keyword}」検索結果
            </span>
        `;

    }

    if(!category && !tag && !keyword){

        html += `
            ＞
            <span>作品一覧</span>
        `;

    }

    breadcrumbArea.innerHTML = html;

}

// --------------------------
// 一覧表示
// --------------------------

function loadWorks(){

    createBreadcrumb();

    const params = new URLSearchParams(location.search);

    const category = params.get("category");
    const keyword = params.get("search");
    const tag = params.get("tag");

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

                work.freeTags.some(item=>

                    item.toLowerCase().includes(word)

                )

            );

        });

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

    sortSelect.addEventListener("change",()=>{

        loadWorks();

    });

}
    
