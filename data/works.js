// ==========================
// Project Library
// works.js
// Version 5.0
// ==========================

const works = [

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