// ==========================
// Project Library
// works.js
// Version 10.3
// ==========================

const works = [
    {
        "id": 1,
        "workNo": "PL-000001",
        "title": "ご褒美シール台紙　緊急車両",
        "category": [
            "幼児向け"
        ],
        "fixedTags": [
            "シール貼り",
            "ごほうびシール"
        ],
        "freeTags": [
            "緊急車両",
            "パトカー",
            "救急車",
            "消防車"
        ],
        "series": [],
        "level": 1,
        "age": "",
        "size": "A4",
        "tools": [],
        "description": "緊急車両のご褒美シールです。ぜひご活用ください。",
        "thumbnail": "assets/images/thumbnail/ご褒美シール台紙_緊急車両_1790603411297.jpg",
        "pdf": "assets/pdf/ご褒美シール台紙_緊急車両_1790603411297.pdf",
        "isNew": true,
        "recommend": false,
        "publishDate": "2026-09-28",
        "updateDate": "2026-09-28",
        "etsy": "",
        "related": [],
        "viewCount": 0,
        "downloadCount": 0,
        "favorite": false
    },
    {
        "id": 2,
        "workNo": "PL-000002",
        "title": "ご褒美シール台紙　電車",
        "category": [
            "幼児向け"
        ],
        "fixedTags": [
            "シール貼り",
            "ごほうびシール"
        ],
        "freeTags": [
            "電車",
            "新幹線"
        ],
        "series": [],
        "level": 1,
        "age": "",
        "size": "A4",
        "tools": [],
        "description": "電車・新幹線ご褒美シールです。ぜひご活用ください。",
        "thumbnail": "assets/images/thumbnail/ご褒美シール台紙_電車_1790603487895.jpg",
        "pdf": "assets/pdf/ご褒美シール台紙_電車_1790603487895.pdf",
        "isNew": true,
        "recommend": false,
        "publishDate": "2026-09-28",
        "updateDate": "2026-09-28",
        "etsy": "",
        "related": [],
        "viewCount": 0,
        "downloadCount": 0,
        "favorite": false
    },
    {
        "id": 3,
        "workNo": "PL-000003",
        "title": "ご褒美シール台紙　恐竜　30マス",
        "category": [
            "幼児向け"
        ],
        "fixedTags": [
            "シール貼り",
            "ごほうびシール"
        ],
        "freeTags": [
            "恐竜"
        ],
        "series": [],
        "level": 1,
        "age": "",
        "size": "A4",
        "tools": [],
        "description": "きょうりゅうこご褒美シールです。ぜひご活用ください。",
        "thumbnail": "assets/images/thumbnail/ご褒美シール台紙_恐竜_30マス_1790648324905.jpg",
        "pdf": "assets/pdf/ご褒美シール台紙_恐竜_30マス_1790648324905.pdf",
        "isNew": true,
        "recommend": false,
        "publishDate": "2026-09-29",
        "updateDate": "2026-09-29",
        "etsy": "",
        "related": [],
        "viewCount": 0,
        "downloadCount": 0,
        "favorite": false
    },
    {
        "id": 4,
        "workNo": "PL-000004",
        "title": "ご褒美シール台紙　宇宙　30マス",
        "category": [
            "幼児向け"
        ],
        "fixedTags": [
            "シール貼り",
            "ごほうびシール"
        ],
        "freeTags": [
            "宇宙",
            "ロケット"
        ],
        "series": [],
        "level": 1,
        "age": "",
        "size": "A4",
        "tools": [],
        "description": "うちゅうのご褒美シールです。ぜひご活用ください。",
        "thumbnail": "assets/images/thumbnail/ご褒美シール台紙_宇宙_30マス_1790648523765.jpg",
        "pdf": "assets/pdf/ご褒美シール台紙_宇宙_30マス_1790648523765.pdf",
        "isNew": true,
        "recommend": false,
        "publishDate": "2026-09-29",
        "updateDate": "2026-09-29",
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

// --------------------------
// デバッグ表示
// --------------------------

console.log(

    `Project Library works.js Version5.0
作品数：${works.length}件`

);