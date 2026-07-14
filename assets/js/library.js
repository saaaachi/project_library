// ==========================
// あたまのストレッチ プリント館
// library.js
// Version 2.0
// ==========================

const cardArea = document.getElementById("cardArea");

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

        <img src="${work.thumbnail}" alt="${work.title}">

        <div class="card-body">

            <h3>${work.title}</h3>

            <p>${createStars(work.level)}</p>

        </div>

    </a>
    `;

}

// --------------------------
// 一覧表示
// --------------------------

function loadWorks(){

    const params = new URLSearchParams(location.search);

    const category = params.get("category");

const keyword = params.get("search");

const tag = params.get("tag");

    let result = works;

    // カテゴリ検索

    if(category){

        result = result.filter(work=>

            work.category.includes(category)

        );

    }

    // タグ検索

if(tag){

    result = result.filter(work=>

        work.fixedTags.includes(tag) ||

        work.freeTags.includes(tag)

    );

}

    // キーワード検索

    if(keyword){

        const word = keyword.toLowerCase();

        result = result.filter(work=>{

            return (

                work.title.toLowerCase().includes(word) ||

                work.description.toLowerCase().includes(word) ||

                work.freeTags.some(tag=>

                    tag.toLowerCase().includes(word)

                )

            );

        });

    }

    // 件数表示

    const count = document.querySelector(".count");

    if(count){

        count.textContent = `作品${result.length}件`;

    }

    // カード生成

    let html = "";

    result.forEach(work=>{

        html += createCard(work);

    });

    cardArea.innerHTML = html;

}

loadWorks();
