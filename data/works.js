// ==========================
// Project Library
// works.js
// Version 5.0
// ==========================

const works = [

{

    id: 1,

    workNo: "PL-000001",

    title: "消防車ぬりえ①",

    category: [
        "子ども向け"
    ],

    fixedTags: [
        "ぬりえ"
    ],

    freeTags: [
        "車",
        "消防車",
        "働く車"
    ],

    series: "消防車シリーズ",

    level: 1,

    age: "3〜6歳",

    size: "A4",

    tools: [
        "色えんぴつ"
    ],

    description:
        "消防車のぬりえです。",

    thumbnail:
        "assets/images/sample.jpg",

    pdf:
        "assets/pdf/firetruck01.pdf",

    isNew: true,

    recommend: true,

    publishDate: "2026-07-12",

    updateDate: "2026-07-12",

    etsy: "",

    related: [],

    // Version5.0追加
    viewCount: 0,

    downloadCount: 0,

    favorite: false

}

];
// --------------------------
// 共通関数
// --------------------------

function getWorkById(id){

    return works.find(

        work => work.id === id

    );

}

function getNewWorks(limit = 5){

    return works

        .filter(work => work.isNew)

        .slice(0, limit);

}

function getRecommendWorks(limit = 5){

    return works

        .filter(work => work.recommend)

        .slice(0, limit);

}

function getSeriesWorks(series, excludeId = null){

    return works.filter(work =>

        work.series === series &&

        work.id !== excludeId

    );

}

function getRelatedWorks(work, limit = 4){

    return works

        .filter(item=>{

            if(item.id === work.id){

                return false;

            }

            return(

                item.category.some(category=>

                    work.category.includes(category)

                ) ||

                item.fixedTags.some(tag=>

                    work.fixedTags.includes(tag)

                ) ||

                item.freeTags.some(tag=>

                    work.freeTags.includes(tag)

                )

            );

        })

        .slice(0, limit);

}

// --------------------------
// デバッグ表示
// --------------------------

console.log(

    `Project Library works.js Version5.0
作品数：${works.length}件`

);
