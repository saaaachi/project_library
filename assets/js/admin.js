// ======================================
// Project Library
// admin.js
// Version 7.2
// Part 1 / 4
// ======================================


// ======================================
// フォーム取得
// ======================================

const form =
    document.getElementById("workForm");


const draftButton =
    document.querySelector(".draft");


const publishButton =
    document.querySelector(".publish");


const pdfInput =
    document.getElementById("pdfFile");


const thumbnailInput =
    document.getElementById("thumbnailFile");


const preview =
    document.getElementById("thumbnailPreview");


const workList =
    document.getElementById("workList");


// ======================================
// works.js 出力欄
// ======================================

const exportArea =
    document.getElementById("exportData");


const copyButton =
    document.getElementById("copyButton");


const copyMessage =
    document.getElementById("copyMessage");


// ======================================
// 編集中ID
// ======================================

let editId = null;


// ======================================
// Cloudflare API Worker
// GitHub Actions接続用
// ======================================

const WORKER_URL =
    "https://project-library-api.saaachi-app.workers.dev";


// ======================================
// PDFファイル
// ======================================

let selectedPdfFile =
    null;


// ======================================
// サムネイルファイル
// ======================================

let selectedThumbnailFile =
    null;


// ======================================
// 作品データの基本形
// ======================================

function createEmptyWorkData(){

    return {

        id: null,

        workNo: "",

        title: "",

        description: "",

        category: [],

        fixedTags: [],

        freeTags: [],

        series: "",

        level: 1,

        age: "",

        size: "A4",

        tools: [],

        thumbnail: "",

        watermark: "",

        pdf: "",

        recommend: false,

        isNew: true,

        publishDate: "",

        updateDate: "",

        etsy: "",

        related: [],

        author: "あたまのストレッチ",

        status: "public"

    };

}


// ======================================
// 現在編集中の作品データ
// ======================================

let workData =
    createEmptyWorkData();


// ======================================
// 難易度表示
// ======================================

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


// ======================================
// サムネイル表示
// ======================================

function showThumbnail(image){

    if(!preview){

        return;

    }


    if(!image){

        resetThumbnail();

        return;

    }


    preview.innerHTML = `

        <img
            src="${image}"
            alt="サムネイルプレビュー"
            style="
                max-width:100%;
                height:auto;
                display:block;
                margin:auto;
            "
        >

    `;

}


// ======================================
// サムネイル初期化
// ======================================

function resetThumbnail(){

    if(!preview){

        return;

    }


    preview.innerHTML =
        "サムネイルプレビュー";

}


// ======================================
// サムネイル画像選択
// ======================================

if(thumbnailInput){

    thumbnailInput.addEventListener(
        "change",
        function(){

            const file =
                this.files[0];


            if(!file){

                selectedThumbnailFile =
                    null;

                workData.thumbnail =
                    "";

                resetThumbnail();

                return;

            }


            selectedThumbnailFile =
                file;


            const reader =
                new FileReader();


            reader.onload =
                function(event){

                    workData.thumbnail =
                        event.target.result;


                    showThumbnail(
                        workData.thumbnail
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


// ======================================
// PDF選択
// ======================================

if(pdfInput){

    pdfInput.addEventListener(
        "change",
        function(){

            const file =
                this.files[0];


            if(!file){

                selectedPdfFile =
                    null;

                workData.pdf =
                    "";

                return;

            }


            selectedPdfFile =
                file;


            workData.pdf =
                file;


            console.log(
                "PDF選択：",
                file.name
            );


            if(preview){

                preview.innerHTML = `

                    <p
                        style="
                            text-align:center;
                            padding:20px;
                        "
                    >

                        📄 PDFを選択しました😊<br>

                        サムネイルを準備します…

                    </p>

                `;

            }

        }
    );

}


// ======================================
// Version表示
// ======================================

console.log(
    "Project Library admin.js Version 7.2 Part 1"
);