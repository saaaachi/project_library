// ==========================
// Project Library
// common.js
// Version 5.0
// ==========================

// --------------------------
// 共通パーツ読み込み
// --------------------------

async function loadComponent(id, file){

    const target = document.getElementById(id);

    if(!target){

        return;

    }

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(file);

        }

        target.innerHTML =

            await response.text();

    }catch(error){

        console.error(

            file + " の読み込みに失敗しました"

        );

    }

}

// --------------------------
// 初期読み込み
// --------------------------

window.addEventListener(

    "DOMContentLoaded",

    async()=>{

await loadComponent(
    "header",
    "components/header.html"
);

await loadComponent(
    "sidebar",
    "components/sidebar.html"
);

await loadComponent(
    "footer",
    "components/footer.html"
);

await loadComponent(
    "adTop",
    "components/ads/top.html"
);

await loadComponent(
    "adMiddle",
    "components/ads/middle.html"
);

await loadComponent(
    "adBottom",
    "components/ads/bottom.html"
);

await loadComponent(
    "adSidebar",
    "components/ads/sidebar.html"
);

setupMenu();

setupSearch();

setupCurrentYear();

    }

);

// --------------------------
// ハンバーガーメニュー
// --------------------------

function setupMenu(){

    const menuButton =

        document.getElementById("menuButton");

    const sidebar =

        document.querySelector(".sidebar");

    const closeMenu =

        document.getElementById("closeMenu");

    if(menuButton && sidebar){

        menuButton.onclick = ()=>{

            sidebar.classList.add("open");

        };

    }

    if(closeMenu && sidebar){

        closeMenu.onclick = ()=>{

            sidebar.classList.remove("open");

        };

    }

}
// --------------------------
// 共通検索
// --------------------------

function setupSearch(){

    const searchInput =

        document.getElementById("searchInput");

    if(!searchInput){

        return;

    }

    searchInput.addEventListener(

        "keydown",

        event=>{

            if(event.key !== "Enter"){

                return;

            }

            const keyword =

                searchInput.value.trim();

            if(keyword === ""){

                location.href =

                    "library.html";

                return;

            }

            location.href =

`library.html?search=${encodeURIComponent(keyword)}`;

        }

    );

}

// --------------------------
// Escキーで閉じる
// --------------------------

document.addEventListener(

    "keydown",

    event=>{

        if(event.key !== "Escape"){

            return;

        }

        const sidebar =

            document.querySelector(".sidebar");

        if(sidebar){

            sidebar.classList.remove("open");

        }

    }

);

// --------------------------
// 背景クリックで閉じる
// --------------------------

document.addEventListener(

    "click",

    event=>{

        const sidebar =

            document.querySelector(".sidebar");

        const menuButton =

            document.getElementById("menuButton");

        if(

            !sidebar ||

            !sidebar.classList.contains("open")

        ){

            return;

        }

        if(

            sidebar.contains(event.target) ||

            menuButton?.contains(event.target)

        ){

            return;

        }

        sidebar.classList.remove("open");

    }

);

// --------------------------
// 年号自動更新
// --------------------------

function setupCurrentYear(){

    const year =

        document.getElementById("currentYear");

    if(year){

        year.textContent =

            new Date().getFullYear();

    }

}

// --------------------------
// Version表示
// --------------------------

console.log(

"Project Library common.js Version5.0"

);
