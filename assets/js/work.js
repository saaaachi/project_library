// ==========================
// Project Library
// work.js
// Version 5.2
// ==========================


// --------------------------
// URL取得
// --------------------------

const params =
    new URLSearchParams(location.search);

const id =
    Number(params.get("id"));


// --------------------------
// 表示エリア
// --------------------------

const area =
    document.getElementById("workArea");


// --------------------------
// データ取得
// --------------------------

const work =
    works.find(item => item.id === id);


// --------------------------
// 安全な文字列化
// --------------------------

function safeString(value){

    if(
        value === undefined ||
        value === null
    ){

        return "";

    }

    return String(value);

}


// --------------------------
// 配列化
// --------------------------

function toArray(value){

    if(Array.isArray(value)){

        return value.filter(
            item =>
                item !== undefined &&
                item !== null &&
                String(item).trim() !== ""
        );

    }


    if(
        value === undefined ||
        value === null ||
        value === ""
    ){

        return [];

    }


    return [value];

}


// --------------------------
// ★表示
// --------------------------

function createStars(level){

    switch(Number(level)){

        case 1:
            return "★☆☆";

        case 2:
            return "★★☆";

        case 3:
            return "★★★";

        default:
            return "";

    }

}


// --------------------------
// NEW表示
// --------------------------

function createNewBadge(work){

    if(!work.isNew){

        return "";

    }


    return `

<span class="badge badge-new">

NEW

</span>

`;

}


// --------------------------
// おすすめ表示
// --------------------------

function createRecommendBadge(work){

    if(!work.recommend){

        return "";

    }


    return `

<span class="badge badge-recommend">

おすすめ

</span>

`;

}


// --------------------------
// パンくず生成
// --------------------------

function createBreadcrumb(work){

    const categories =
        toArray(
            work.category
        );


    let html = `

<div class="breadcrumb">

<a href="index.html">

ホーム

</a>

＞

<a href="library.html">

作品一覧

</a>

`;


    categories.forEach(
        category => {

            html += `

＞

<a
href="library.html?category=${encodeURIComponent(category)}">

${category}

</a>

`;

        }
    );


    html += `

＞

<span class="current">

${safeString(work.title)}

</span>

</div>

`;


    return html;

}


// --------------------------
// ダウンロード用ファイル名
// --------------------------

function createDownloadFileName(title){

    const safeTitle =
        safeString(title)
            .replace(
                /[\\/:*?"<>|]/g,
                ""
            )
            .trim()
            .replace(
                /\s+/g,
                "_"
            );


    return (
        safeTitle ||
        "Project_Library"
    ) + ".pdf";

}


// --------------------------
// 見つからない場合
// --------------------------

if(!work){

    area.innerHTML = `

<section class="container">

<h2>

作品が見つかりませんでした。

</h2>

<p>

URLをご確認ください。

</p>

<a
class="button"
href="library.html">

作品一覧へ戻る

</a>

</section>

`;

}else{


// --------------------------
// データを正規化
// --------------------------

const categories =
    toArray(
        work.category
    );


const fixedTags =
    toArray(
        work.fixedTags
    );


const freeTags =
    toArray(
        work.freeTags
    );


const tools =
    toArray(
        work.tools
    );


const series =
    toArray(
        work.series
    );


// --------------------------
// メイン表示
// --------------------------

area.innerHTML = `

<section class="container">

${createBreadcrumb(work)}

${createNewBadge(work)}
${createRecommendBadge(work)}

<h1 class="section-title">

${safeString(work.title)}

</h1>

<p class="level">

${createStars(work.level)}

</p>


<div class="card-tags">

${categories.map(category => `

<a
class="tag"
href="library.html?category=${encodeURIComponent(category)}">

${category}

</a>

`).join("")}

</div>


<div class="work-image">

<img
src="${safeString(work.thumbnail)}"
alt="${safeString(work.title)}">

</div>


<div class="info-box">

<div class="info-item">

<b>対象年齢</b>

<br>

${safeString(work.age)}

</div>


<div class="info-item">

<b>印刷サイズ</b>

<br>

${safeString(work.size)}

</div>


<div class="info-item">

<b>必要な道具</b>

<br>

${tools.join("・")}

</div>

</div>


<div class="work-description">

${safeString(work.description)}

</div>


<h3>

タグ

</h3>


<div class="card-tags">

${
    fixedTags.map(
        tag => `

<a
class="tag"
href="library.html?tag=${encodeURIComponent(tag)}">

${tag}

</a>

`
    ).join("")
}

${
    freeTags.map(
        tag => `

<a
class="tag"
href="library.html?tag=${encodeURIComponent(tag)}">

${tag}

</a>

`
    ).join("")
}

${
    fixedTags.length === 0 &&
    freeTags.length === 0
        ? `
<p
style="
color:#888;
font-size:14px;
margin:8px 0 0;
">

タグはありません。

</p>
`
        : ""
}

</div>


<script
async
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1299640300068792"
crossorigin="anonymous">
</script>


<!-- プリント横長レスポンシブ -->

<ins
class="adsbygoogle"
style="display:block"
data-ad-client="ca-pub-1299640300068792"
data-ad-slot="6020574861"
data-ad-format="auto"
data-full-width-responsive="true">
</ins>


<script>

(adsbygoogle = window.adsbygoogle || []).push({});

</script>


<!-- ==========================
     PDFダウンロード
     ========================== -->

<button
type="button"
class="button download-button"
id="pdfDownloadButton"
aria-label="${safeString(work.title)}のPDFをダウンロード">

📄 PDFをダウンロード

</button>


<p
id="pdfDownloadHelp"
style="
font-size:13px;
color:#777;
margin-top:8px;
">

iPhoneでは「ファイルに保存」を選択できます。

</p>


<div class="section">

<h3>

ご利用について

</h3>

<p>

個人・教育・施設利用は無料です。<br>
再配布・販売・データの転載は禁止しています。

</p>

</div>


<div id="seriesArea"></div>

<div id="relatedArea"></div>

<div id="moveArea"></div>


</section>

`;


// --------------------------
// PDFダウンロード処理
// --------------------------

const pdfDownloadButton =
    document.getElementById(
        "pdfDownloadButton"
    );


const pdfDownloadHelp =
    document.getElementById(
        "pdfDownloadHelp"
    );


pdfDownloadButton?.addEventListener(
    "click",
    async function(){

        if(!work.pdf){

            alert(
                "PDFファイルが見つかりません。"
            );

            return;

        }


        const originalText =
            pdfDownloadButton.textContent;


        pdfDownloadButton.disabled =
            true;


        pdfDownloadButton.textContent =
            "📄 PDFを準備中…";


        try{

            /*
             * PDFを取得
             */

            const response =
                await fetch(
                    work.pdf
                );


            if(!response.ok){

                throw new Error(
                    "PDFを取得できませんでした。"
                );

            }


            const blob =
                await response.blob();


            /*
             * PDFファイルを作成
             */

            const fileName =
                createDownloadFileName(
                    work.title
                );


            const pdfFile =
                new File(
                    [blob],
                    fileName,
                    {
                        type:
                            "application/pdf"
                    }
                );


            /*
             * iPhone / Safariなど、
             * ファイル共有に対応している場合
             */

            if(
                navigator.share &&
                navigator.canShare &&
                navigator.canShare({
                    files:
                        [pdfFile]
                })
            ){

                await navigator.share({

                    files:
                        [pdfFile],

                    title:
                        fileName,

                    text:
                        `${safeString(work.title)}`
                });


                if(pdfDownloadHelp){

                    pdfDownloadHelp.textContent =
                        "PDFの共有・保存画面を開きました😊";

                }

            }else{

                /*
                 * 非対応ブラウザ用
                 * 通常のダウンロードへ
                 */

                const url =
                    URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    url;


                link.download =
                    fileName;


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                setTimeout(
                    function(){

                        URL.revokeObjectURL(
                            url
                        );

                    },
                    1000
                );


                if(pdfDownloadHelp){

                    pdfDownloadHelp.textContent =
                        "PDFのダウンロードを開始しました😊";

                }

            }


        }catch(error){

            console.error(
                error
            );


            /*
             * ユーザーが共有画面を
             * 閉じただけの場合は
             * エラー表示しない。
             */

            if(
                error.name ===
                "AbortError"
            ){

                if(pdfDownloadHelp){

                    pdfDownloadHelp.textContent =
                        "PDFの保存をキャンセルしました。";

                }

            }else{

                console.error(
                    "PDF download error:",
                    error
                );


                /*
                 * 最終フォールバックとして
                 * PDFを新しいタブで開く
                 */

                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    work.pdf;


                link.target =
                    "_blank";


                link.rel =
                    "noopener";


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                if(pdfDownloadHelp){

                    pdfDownloadHelp.textContent =
                        "PDFを開きました。画面の共有ボタンから保存できます。";

                }

            }

        }finally{

            pdfDownloadButton.disabled =
                false;


            pdfDownloadButton.textContent =
                originalText;

        }

    }
);

}


// --------------------------
// シリーズ作品
// --------------------------

if(work){

    const seriesArea =
        document.getElementById(
            "seriesArea"
        );


    const currentSeries =
        toArray(
            work.series
        );


    /*
     * シリーズ未設定なら
     * 何も表示しない。
     */

    if(
        seriesArea &&
        currentSeries.length > 0
    ){

        const seriesWorks =
            works.filter(
                item => {

                    if(
                        item.id ===
                        work.id
                    ){

                        return false;

                    }


                    const itemSeries =
                        toArray(
                            item.series
                        );


                    return itemSeries.some(
                        series =>
                            currentSeries.includes(
                                series
                            )
                    );

                }
            );


        if(seriesWorks.length){

            seriesArea.innerHTML = `

<h2 class="section-title">

📚 同じシリーズ

</h2>

<div class="card-grid">

${seriesWorks.map(item => `

<a
class="card"
href="work.html?id=${item.id}">

<img
src="${safeString(item.thumbnail)}"
alt="${safeString(item.title)}">

<div class="card-body">

${createNewBadge(item)}

${createRecommendBadge(item)}

<h3>

${safeString(item.title)}

</h3>

<p>

${createStars(item.level)}

</p>

</div>

</a>

`).join("")}

</div>

`;

        }

    }

}


// --------------------------
// 関連作品
// --------------------------

if(work){

    const relatedArea =
        document.getElementById(
            "relatedArea"
        );


    const currentCategories =
        toArray(
            work.category
        );


    const currentFixedTags =
        toArray(
            work.fixedTags
        );


    const currentFreeTags =
        toArray(
            work.freeTags
        );


    const relatedWorks =
        works.filter(
            item => {

                if(
                    item.id ===
                    work.id
                ){

                    return false;

                }


                const itemCategories =
                    toArray(
                        item.category
                    );


                const itemFixedTags =
                    toArray(
                        item.fixedTags
                    );


                const itemFreeTags =
                    toArray(
                        item.freeTags
                    );


                const sameCategory =
                    itemCategories.some(
                        category =>
                            currentCategories.includes(
                                category
                            )
                    );


                const sameFixedTag =
                    itemFixedTags.some(
                        tag =>
                            currentFixedTags.includes(
                                tag
                            )
                    );


                const sameFreeTag =
                    itemFreeTags.some(
                        tag =>
                            currentFreeTags.includes(
                                tag
                            )
                    );


                return (
                    sameCategory ||
                    sameFixedTag ||
                    sameFreeTag
                );

            }
        )
        .slice(
            0,
            4
        );


    if(
        relatedArea &&
        relatedWorks.length
    ){

        relatedArea.innerHTML = `

<h2 class="section-title">

💡 関連作品

</h2>

<div class="card-grid">

${relatedWorks.map(item => `

<a
class="card"
href="work.html?id=${item.id}">

<img
src="${safeString(item.thumbnail)}"
alt="${safeString(item.title)}">

<div class="card-body">

${createNewBadge(item)}

${createRecommendBadge(item)}

<h3>

${safeString(item.title)}

</h3>

<p>

${createStars(item.level)}

</p>

</div>

</a>

`).join("")}

</div>

`;

    }

}


// --------------------------
// 前へ・次へ
// --------------------------

if(work){

    const moveArea =
        document.getElementById(
            "moveArea"
        );


    const index =
        works.findIndex(
            item =>
                item.id ===
                work.id
        );


    const prev =
        works[index - 1];


    const next =
        works[index + 1];


    if(moveArea){

        moveArea.innerHTML = `

<div
class="section"
style="
display:flex;
justify-content:space-between;
align-items:center;
flex-wrap:wrap;
gap:15px;
">

${
    prev
        ? `

<a
class="button"
href="work.html?id=${prev.id}">

⬅ 前の作品

</a>

`
        : "<div></div>"
}


${
    next
        ? `

<a
class="button"
href="work.html?id=${next.id}">

次の作品 ➜

</a>

`
        : ""
}

</div>

`;

    }

}


// --------------------------
// タイトル変更
// --------------------------

if(work){

    document.title =
        `${safeString(work.title)} | Project Library`;

}


// --------------------------
// meta description
// --------------------------

if(work){

    const description =
        document.querySelector(
            'meta[name="description"]'
        );


    if(description){

        description.setAttribute(
            "content",
            `${safeString(work.title)}｜${safeString(work.description)}`
        );

    }

}


// --------------------------
// 公開日表示（将来用）
// --------------------------

if(work){

    console.log(
        "公開日 :",
        work.publishDate
    );


    console.log(
        "更新日 :",
        work.updateDate
    );

}


// --------------------------
// Version表示
// --------------------------

console.log(
    "Project Library work.js Version 5.2"
);