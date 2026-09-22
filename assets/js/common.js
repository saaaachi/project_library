// ==========================
// Project Library
// common.js
// Version 6.0
// ==========================


// --------------------------
// 共通パーツ読み込み
// --------------------------

async function loadComponent(id, file){

    const target =
        document.getElementById(id);

    if(!target){

        return;

    }

    try{

        const response =
            await fetch(file);

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


        // --------------------------
        // 共通機能
        // --------------------------

        setupMenu();

        setupSearch();

        setupCurrentYear();

        setupDynamicSidebar();

    }

);


// =====================================================
// 動的サイドバー
// works.jsから対象者・ジャンル・人気タグを生成
// =====================================================

function setupDynamicSidebar(){


    // --------------------------
    // works.js確認
    // --------------------------

    if(
        typeof works === "undefined" ||
        !Array.isArray(works)
    ){

        console.warn(
            "works.js が読み込まれていないため、サイドバーを生成できません。"
        );

        return;

    }


    // --------------------------
    // 対象者
    // --------------------------

    const categoryMenu =
        document.getElementById("categoryMenu");


    // Project Libraryの固定カテゴリ
    const categories = [

        "幼児向け",

        "子ども向け",

        "大人向け",

        "シニア・リハビリ"

    ];


    if(categoryMenu){

        categoryMenu.innerHTML =

            categories.map(category=>{


                const count =

                    works.filter(work=>{

                        return Array.isArray(work.category) &&
                            work.category.includes(category);

                    }).length;


                return `

                    <a
                    href="library.html?category=${encodeURIComponent(category)}">

                    ${category} (${count})

                    </a>

                `;

            }).join("");

    }


    // --------------------------
    // ジャンル
    // fixedTagsから自動取得
    // --------------------------

    const genreMenu =
        document.getElementById("genreMenu");


    const genreCounts = {};


    works.forEach(work=>{


        if(
            !Array.isArray(work.fixedTags)
        ){

            return;

        }


        work.fixedTags.forEach(tag=>{


            if(!tag){

                return;

            }


            if(
                !genreCounts[tag]
            ){

                genreCounts[tag] = 0;

            }


            genreCounts[tag]++;

        });

    });


    if(genreMenu){

        const genres =

            Object.entries(genreCounts)

                .sort((a,b)=>{

                    return a[0].localeCompare(
                        b[0],
                        "ja"
                    );

                });


        if(genres.length === 0){

            genreMenu.innerHTML =

                `<p class="menu-empty">
                作品がまだありません
                </p>`;

        }else{

            genreMenu.innerHTML =

                genres.map(([tag,count])=>{

                    return `

                        <a
                        href="library.html?tag=${encodeURIComponent(tag)}">

                        ${tag} (${count})

                        </a>

                    `;

                }).join("");

        }

    }


    // --------------------------
    // 人気タグ
    // freeTagsの使用数から上位4つ
    // --------------------------

    const popularTagMenu =
        document.getElementById("popularTagMenu");


    const freeTagCounts = {};


    works.forEach(work=>{


        if(
            !Array.isArray(work.freeTags)
        ){

            return;

        }


        work.freeTags.forEach(tag=>{


            if(!tag){

                return;

            }


            if(
                !freeTagCounts[tag]
            ){

                freeTagCounts[tag] = 0;

            }


            freeTagCounts[tag]++;

        });

    });


    if(popularTagMenu){

        const popularTags =

            Object.entries(freeTagCounts)

                .sort((a,b)=>{

                    // 使用数の多い順
                    if(b[1] !== a[1]){

                        return b[1] - a[1];

                    }

                    // 同数なら五十音順
                    return a[0].localeCompare(
                        b[0],
                        "ja"
                    );

                })

                .slice(0,4);


        if(popularTags.length === 0){

            popularTagMenu.innerHTML =

                `<p class="menu-empty">
                作品がまだありません
                </p>`;

        }else{

            popularTagMenu.innerHTML =

                popularTags.map(([tag,count])=>{

                    return `

                        <a
                        href="library.html?tag=${encodeURIComponent(tag)}">

                        ${tag} (${count})

                        </a>

                    `;

                }).join("");

        }

    }


    console.log(
        "Project Library 動的サイドバー Version 6.0"
    );

}


// =====================================================
// ハンバーガーメニュー
// =====================================================

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


// =====================================================
// 共通検索
// =====================================================

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


// =====================================================
// Escキーで閉じる
// =====================================================

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


// =====================================================
// 背景クリックで閉じる
// =====================================================

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


// =====================================================
// 年号自動更新
// =====================================================

function setupCurrentYear(){

    const year =
        document.getElementById("currentYear");


    if(year){

        year.textContent =
            new Date().getFullYear();

    }

}


// =====================================================
// Version表示
// =====================================================

console.log(
    "Project Library common.js Version 6.0"
);