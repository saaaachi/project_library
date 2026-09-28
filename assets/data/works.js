// ==========================
// Project Library
// works.js
// Version 10.3
// ==========================

const works = [
    {
        "id": 1,
        "workNo": "PL-000001",
        "title": "消防車ぬりえ①",
        "category": [
            "子ども向け"
        ],
        "fixedTags": [
            "ぬりえ"
        ],
        "freeTags": [
            "車",
            "消防車",
            "働く車"
        ],
        "series": "消防車シリーズ",
        "level": 1,
        "age": "3〜6歳",
        "size": "A4",
        "tools": [
            "色えんぴつ"
        ],
        "description": "消防車のぬりえです。",
        "thumbnail": "assets/images/sample.jpg",
        "pdf": "assets/pdf/firetruck01.pdf",
        "isNew": true,
        "recommend": true,
        "publishDate": "2026-07-12",
        "updateDate": "2026-07-12",
        "etsy": "",
        "related": [],
        "viewCount": 0,
        "downloadCount": 0,
        "favorite": false
    },
    {
        "id": 9,
        "workNo": "PL-000009",
        "title": "テスト7",
        "category": [
            "シニア・リハビリ"
        ],
        "fixedTags": [
            "テスト"
        ],
        "freeTags": [
            "テスト"
        ],
        "series": [],
        "level": 1,
        "age": "",
        "size": "A4",
        "tools": [],
        "description": "",
        "thumbnail": "assets/images/thumbnail/テスト7_1790473914778.jpg",
        "pdf": "assets/pdf/テスト7_1790473914778.pdf",
        "isNew": true,
        "recommend": false,
        "publishDate": "2026-09-27",
        "updateDate": "2026-09-27",
        "etsy": "",
        "related": [],
        "viewCount": 0,
        "downloadCount": 0,
        "favorite": false
    },
    {
        "id": 10,
        "workNo": "PL-000010",
        "title": "テスト8",
        "category": [
            "シニア・リハビリ"
        ],
        "fixedTags": [
            "テスト"
        ],
        "freeTags": [
            "テスト"
        ],
        "series": [],
        "level": 1,
        "age": "",
        "size": "A4",
        "tools": [],
        "description": "",
        "thumbnail": "assets/images/thumbnail/テスト8_1790473942723.jpg",
        "pdf": "assets/pdf/テスト8_1790473942723.pdf",
        "isNew": true,
        "recommend": false,
        "publishDate": "2026-09-27",
        "updateDate": "2026-09-27",
        "etsy": "",
        "related": [],
        "viewCount": 0,
        "downloadCount": 0,
        "favorite": false
    },
    {
        "id": 11,
        "workNo": "PL-000011",
        "title": "テストa",
        "category": [
            "幼児向け",
            "子ども向け"
        ],
        "fixedTags": [
            "テスト"
        ],
        "freeTags": [
            "消防車",
            "テスト"
        ],
        "series": [],
        "level": 1,
        "age": "",
        "size": "A4",
        "tools": [],
        "description": "テスト",
        "thumbnail": "assets/images/thumbnail/テストa_1790484003473.jpg",
        "pdf": "assets/pdf/テストa_1790484003473.pdf",
        "isNew": true,
        "recommend": false,
        "publishDate": "2026-09-27",
        "updateDate": "2026-09-27",
        "etsy": "",
        "related": [],
        "viewCount": 0,
        "downloadCount": 0,
        "favorite": false
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

console.log(
    `Project Library works.js Version5.0
作品数：${works.length}件`
);
