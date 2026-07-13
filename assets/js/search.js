// ==========================
// Project Library
// search.js
// Version 1.0
// ==========================

// 検索ボックス
const searchInput = document.getElementById("searchInput");

// カード表示エリア
const cardArea = document.getElementById("cardArea");

// --------------------------
// カード表示
// --------------------------

function renderWorks(list){

    if(!cardArea) return;

    let html = "";

    list.forEach(work=>{

        html += createCard(work);

    });

    cardArea.innerHTML = html;

}

// --------------------------
// 検索
// --------------------------

function searchWorks(keyword){

    keyword = keyword.toLowerCase();

    const result = works.filter(work=>{

        return (

            work.title.toLowerCase().includes(keyword)

            ||

            work.category.join(" ").toLowerCase().includes(keyword)

            ||

            work.fixedTags.join(" ").toLowerCase().includes(keyword)

            ||

            work.freeTags.join(" ").toLowerCase().includes(keyword)

        );

    });

    renderWorks(result);

}

// --------------------------
// 入力イベント
// --------------------------

if(searchInput){

    searchInput.addEventListener("input",function(){

        const keyword=this.value.trim();

        if(keyword===""){

            renderWorks(works);

        }else{

            searchWorks(keyword);

        }

    });

}
