// ==========================
// Project Library
// common.js
// Version 1.0
// ==========================

// --------------------------
// メニュー開閉
// --------------------------

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const closeMenu = document.getElementById("closeMenu");

if(menuButton){

    menuButton.onclick = () => {

        sidebar.classList.add("open");

    };

}

if(closeMenu){

    closeMenu.onclick = () => {

        sidebar.classList.remove("open");

    };

}

// --------------------------
// 共通検索
// --------------------------

const searchInput = document.getElementById("searchInput");

if(searchInput){

    searchInput.addEventListener("focus",()=>{

        console.log("検索開始");

    });

}
