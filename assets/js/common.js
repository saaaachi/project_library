// ==========================
// Project Library
// common.js
// Version 1.1
// ==========================

// --------------------------
// 共通パーツ読込
// --------------------------

async function loadComponent(id, file){

    const target = document.getElementById(id);

    if(!target) return;

    try{

        const response = await fetch(file);

        target.innerHTML = await response.text();

    }catch(error){

        console.error(file + " の読み込みに失敗しました");

    }

}

window.addEventListener("DOMContentLoaded", async ()=>{

    await loadComponent("header","components/header.html");

    await loadComponent("sidebar","components/sidebar.html");

    await loadComponent("footer","components/footer.html");

    setupMenu();

    setupSearch();

});

// --------------------------
// メニュー開閉
// --------------------------

function setupMenu(){

    const menuButton = document.getElementById("menuButton");

    const sidebar = document.querySelector(".sidebar");

    const closeMenu = document.getElementById("closeMenu");

    if(menuButton){

        menuButton.onclick = ()=>{

            sidebar.classList.add("open");

        };

    }

    if(closeMenu){

        closeMenu.onclick = ()=>{

            sidebar.classList.remove("open");

        };

    }

}

// --------------------------
// 共通検索
// --------------------------

function setupSearch(){

    const searchInput = document.getElementById("searchInput");

    if(!searchInput) return;

    // Enterキーで検索

    searchInput.addEventListener("keydown",(event)=>{

        if(event.key !== "Enter") return;

        const keyword = searchInput.value.trim();

        if(keyword===""){

            location.href="library.html";

            return;

        }

        location.href =
            `library.html?search=${encodeURIComponent(keyword)}`;

    });

}
