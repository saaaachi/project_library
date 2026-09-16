// ======================================
// Project Library
// admin.js
// Version 7.4
// PDF・サムネイル送信対応版
// ======================================


// --------------------------------------
// DOM
// --------------------------------------

const form = document.getElementById("workForm");

const draftButton =
    document.querySelector(".draft");

const publishButton =
    document.querySelector(".publish");

const pdfInput =
    document.getElementById("pdfFile");

const preview =
    document.getElementById("thumbnailPreview");

const workList =
    document.getElementById("workList");

const exportArea =
    document.getElementById("exportData");

const copyButton =
    document.getElementById("copyButton");

const copyMessage =
    document.getElementById("copyMessage");


// --------------------------------------
// GitHub公開用 Cloudflare Worker
// --------------------------------------

const WORKER_URL =
    "https://project-library-api.saaachi-app.workers.dev";


// --------------------------------------
// 状態
// --------------------------------------

let editId = null;

let selectedPdfFile = null;

let workData =
    createEmptyWorkData();


// --------------------------------------
// 空の作品データ
// --------------------------------------

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


// --------------------------------------
// 難易度
// --------------------------------------

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


// --------------------------------------
// 配列化
// --------------------------------------

function toArray(value){

    if(Array.isArray(value)){

        return value;

    }


    if(
        typeof value !== "string" ||
        value.trim() === ""
    ){

        return [];

    }


    return value
        .split(",")
        .map(function(item){

            return item.trim();

        })
        .filter(Boolean);

}


// --------------------------------------
// サムネイル表示
// --------------------------------------

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
                width:100%;
                height:auto;
                display:block;
                margin:auto;
            "
        >

    `;

}


// --------------------------------------
// サムネイル初期化
// --------------------------------------

function resetThumbnail(){

    if(!preview){

        return;

    }


    preview.innerHTML =
        "サムネイルプレビュー";

}


// --------------------------------------
// PDF.js
// --------------------------------------

let pdfjsReady = null;


async function loadPdfJs(){

    if(pdfjsReady){

        return pdfjsReady;

    }


    pdfjsReady =
        import(
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
        )
        .then(function(pdfjs){

            if(
                pdfjs.GlobalWorkerOptions
            ){

                pdfjs.GlobalWorkerOptions.workerSrc =
                    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

            }


            return pdfjs;

        });


    return pdfjsReady;

}


// --------------------------------------
// PDF → サムネイル生成
// ＋ 透かし
// --------------------------------------

async function createPdfThumbnailWithWatermark(file){

    const pdfjs =
        await loadPdfJs();


    const arrayBuffer =
        await file.arrayBuffer();


    const pdf =
        await pdfjs
            .getDocument({
                data: arrayBuffer
            })
            .promise;


    const page =
        await pdf.getPage(1);


    // ----------------------------------
    // サムネイル画像サイズ
    // ----------------------------------

    const viewport =
        page.getViewport({
            scale: 1.2
        });


    const canvas =
        document.createElement("canvas");


    const context =
        canvas.getContext("2d");


    canvas.width =
        viewport.width;


    canvas.height =
        viewport.height;


    // ----------------------------------
    // PDF 1ページ目を描画
    // ----------------------------------

    await page.render({

        canvasContext:
            context,

        viewport:
            viewport

    }).promise;


    // ----------------------------------
    // 透かし
    // ----------------------------------

    context.save();


    context.globalAlpha =
        0.20;


    context.fillStyle =
        "#666666";


    context.textAlign =
        "center";


    context.textBaseline =
        "middle";


    context.translate(

        canvas.width / 2,

        canvas.height / 2

    );


    context.rotate(
        -Math.PI / 6
    );


    // ----------------------------------
    // 透かし①
    // ----------------------------------

    context.font =
        "bold 34px sans-serif";


    context.fillText(
        "Project Library",
        0,
        -90
    );


    context.font =
        "bold 28px sans-serif";


    context.fillText(
        "無料プリント",
        0,
        -45
    );


    // ----------------------------------
    // 透かし②
    // ----------------------------------

    context.font =
        "bold 34px sans-serif";


    context.fillText(
        "Project Library",
        0,
        20
    );


    context.font =
        "bold 28px sans-serif";


    context.fillText(
        "無料プリント",
        0,
        65
    );


    // ----------------------------------
    // 透かし③
    // ----------------------------------

    context.font =
        "bold 34px sans-serif";


    context.fillText(
        "Project Library",
        0,
        130
    );


    context.font =
        "bold 28px sans-serif";


    context.fillText(
        "無料プリント",
        0,
        175
    );


    context.restore();


    // ----------------------------------
    // JPEG化
    // ----------------------------------

    return canvas.toDataURL(
        "image/jpeg",
        0.82
    );

}


// --------------------------------------
// PDF選択
// --------------------------------------

if(pdfInput){

    pdfInput.addEventListener(
        "change",
        async function(){

            const file =
                this.files[0];


            if(!file){

                selectedPdfFile =
                    null;


                workData.pdf =
                    "";


                workData.thumbnail =
                    "";


                resetThumbnail();


                return;

            }


            // ----------------------------------
            // PDFを保持
            // ----------------------------------

            selectedPdfFile =
                file;


            workData.pdf =
                file;


            // ----------------------------------
            // 読み込み中
            // ----------------------------------

            if(preview){

                preview.innerHTML = `

                    <p
                        style="
                            text-align:center;
                            padding:20px;
                            line-height:1.8;
                        "
                    >

                        📄 PDFを読み込み中…<br>

                        サムネイルを作成しています😊

                    </p>

                `;

            }


            try{

                const thumbnail =
                    await createPdfThumbnailWithWatermark(
                        file
                    );


                if(thumbnail){

                    workData.thumbnail =
                        thumbnail;


                    showThumbnail(
                        thumbnail
                    );


                    console.log(
                        "透かし付きサムネイル生成完了✨"
                    );

                }

            }
            catch(error){

                console.error(
                    "PDFサムネイル生成エラー:",
                    error
                );


                workData.thumbnail =
                    "";


                resetThumbnail();


                alert(
                    "PDFのサムネイル生成に失敗しました🥲"
                );

            }

        }
    );

}


// --------------------------------------
// カテゴリ取得
// --------------------------------------

function getSelectedCategories(){

    if(!form){

        return [];

    }


    const checkboxes =
        form.querySelectorAll(
            'input[type="checkbox"]'
        );


    const categories = [];


    checkboxes.forEach(
        function(checkbox){

            if(checkbox.checked){

                categories.push(
                    checkbox.value
                );

            }

        }
    );


    return categories;

}


// --------------------------------------
// フォーム取得
// --------------------------------------

function collectFormData(){

    const categories =
        getSelectedCategories();


    return {

        title:
            document
                .getElementById("title")
                .value
                .trim(),


        description:
            document
                .getElementById("description")
                .value
                .trim(),


        category:
            categories,


        fixedTags:
            toArray(
                document
                    .getElementById("fixedTags")
                    .value
            ),


        freeTags:
            toArray(
                document
                    .getElementById("freeTags")
                    .value
            ),


        series:
            document
                .getElementById("series")
                .value
                .trim(),


        level:
            Number(
                document
                    .getElementById("difficulty")
                    .value
            ),


        age:
            document
                .getElementById("age")
                .value
                .trim(),


        size:
            document
                .getElementById("size")
                .value,


        tools:
            toArray(
                document
                    .getElementById("tools")
                    .value
            ),


        thumbnail:
            workData.thumbnail,


        pdf:
            selectedPdfFile
                ? selectedPdfFile.name
                : workData.pdf,


        author:
            "あたまのストレッチ",


        status:
            "public"

    };

}


// --------------------------------------
// 入力チェック
// --------------------------------------

function validateForm(data){

    if(!data.title){

        alert(
            "タイトルを入力してください🥹"
        );

        return false;

    }


    if(
        !data.category ||
        data.category.length === 0
    ){

        alert(
            "カテゴリを1つ以上選択してください🥹"
        );

        return false;

    }


    if(
        !selectedPdfFile &&
        !workData.pdf
    ){

        alert(
            "PDFを選択してください🥹"
        );

        return false;

    }


    if(!workData.thumbnail){

        alert(
            "サムネイルがまだ生成されていません🥹\n" +
            "PDFをもう一度選択してください。"
        );

        return false;

    }


    return true;

}


// --------------------------------------
// 次のID
// --------------------------------------

function getNextWorkId(){

    if(
        typeof works === "undefined" ||
        !Array.isArray(works)
    ){

        return 1;

    }


    if(works.length === 0){

        return 1;

    }


    const ids =
        works.map(
            function(work){

                return Number(work.id) || 0;

            }
        );


    return Math.max(...ids) + 1;

}


// --------------------------------------
// 次の作品番号
// --------------------------------------

function getNextWorkNo(){

    if(
        typeof works === "undefined" ||
        !Array.isArray(works) ||
        works.length === 0
    ){

        return "001";

    }


    const numbers =
        works.map(
            function(work){

                return (
                    parseInt(
                        work.workNo,
                        10
                    ) || 0
                );

            }
        );


    const next =
        Math.max(...numbers) + 1;


    return String(next)
        .padStart(3, "0");

}


// --------------------------------------
// 作品データ生成
// --------------------------------------

function generateWorkData(){

    const data =
        collectFormData();


    if(!validateForm(data)){

        return null;

    }


    const now =
        new Date()
            .toISOString()
            .slice(0,10);


    const existingWork =
        editId !== null &&
        typeof works !== "undefined"

            ? works.find(
                function(work){

                    return (
                        Number(work.id) ===
                        Number(editId)
                    );

                }
            )

            : null;


    const result = {

        id:
            existingWork
                ? existingWork.id
                : getNextWorkId(),


        workNo:
            existingWork
                ? existingWork.workNo
                : getNextWorkNo(),


        title:
            data.title,


        description:
            data.description,


        category:
            data.category,


        fixedTags:
            data.fixedTags,


        freeTags:
            data.freeTags,


        series:
            data.series,


        level:
            data.level,


        age:
            data.age,


        size:
            data.size,


        tools:
            data.tools,


        thumbnail:
            data.thumbnail,


        watermark:
            existingWork
                ? existingWork.watermark || ""
                : "",


        pdf:
            data.pdf,


        recommend:
            existingWork
                ? Boolean(
                    existingWork.recommend
                )
                : false,


        isNew:
            true,


        publishDate:
            existingWork
                ? existingWork.publishDate || now
                : now,


        updateDate:
            now,


        etsy:
            existingWork
                ? existingWork.etsy || ""
                : "",


        related:
            existingWork
                ? existingWork.related || []
                : [],


        author:
            "あたまのストレッチ",


        status:
            "public"

    };


    return result;

}


// --------------------------------------
// 保存
// --------------------------------------

function saveWork(){

    const data =
        generateWorkData();


    if(!data){

        return null;

    }


    workData =
        data;


    updateExportArea();

    renderList();


    return data;

}


// --------------------------------------
// 下書き
// --------------------------------------

if(draftButton){

    draftButton.addEventListener(
        "click",
        function(){

            const data =
                generateWorkData();


            if(!data){

                return;

            }


            data.status =
                "draft";


            workData =
                data;


            updateExportArea();


            alert(
                "下書きを保存しました😊"
            );

        }
    );

}


// --------------------------------------
// works.js形式へ変換
// --------------------------------------

function formatWorkData(data){

    return `{
    id: ${data.id},
    workNo:
        "${data.workNo}",
    title:
        ${JSON.stringify(data.title)},
    description:
        ${JSON.stringify(data.description)},
    category:
        ${JSON.stringify(data.category, null, 4)},
    fixedTags:
        ${JSON.stringify(data.fixedTags, null, 4)},
    freeTags:
        ${JSON.stringify(data.freeTags, null, 4)},
    series:
        ${JSON.stringify(data.series)},
    level:
        ${data.level},
    age:
        ${JSON.stringify(data.age)},
    size:
        ${JSON.stringify(data.size)},
    tools:
        ${JSON.stringify(data.tools, null, 4)},
    thumbnail:
        ${JSON.stringify(data.thumbnail)},
    watermark:
        ${JSON.stringify(data.watermark)},
    pdf:
        ${JSON.stringify(data.pdf)},
    recommend:
        ${data.recommend},
    isNew:
        ${data.isNew},
    publishDate:
        ${JSON.stringify(data.publishDate)},
    updateDate:
        ${JSON.stringify(data.updateDate)},
    etsy:
        ${JSON.stringify(data.etsy)},
    related:
        ${JSON.stringify(data.related, null, 4)},
    author:
        ${JSON.stringify(data.author)},
    status:
        ${JSON.stringify(data.status)}
}`;

}


// --------------------------------------
// 出力エリア更新
// --------------------------------------

function updateExportArea(){

    if(!exportArea){

        return;

    }


    if(!workData){

        exportArea.value =
            "";

        return;

    }


    exportArea.value =
        formatWorkData(
            workData
        );

}


// --------------------------------------
// コピー
// --------------------------------------

if(copyButton){

    copyButton.addEventListener(
        "click",
        async function(){

            if(
                !exportArea ||
                !exportArea.value
            ){

                return;

            }


            try{

                await navigator
                    .clipboard
                    .writeText(
                        exportArea.value
                    );


                if(copyMessage){

                    copyMessage.textContent =
                        "コピーしました😊";

                }

            }
            catch(error){

                console.error(
                    "コピーエラー:",
                    error
                );


                if(copyMessage){

                    copyMessage.textContent =
                        "コピーに失敗しました🥲";

                }

            }

        }
    );

}


// --------------------------------------
// 作品一覧
// --------------------------------------

function renderList(){

    if(!workList){

        return;

    }


    if(
        typeof works === "undefined" ||
        !Array.isArray(works)
    ){

        workList.innerHTML = `

            <tr>

                <td colspan="5">
                    作品データがありません
                </td>

            </tr>

        `;

        return;

    }


    if(works.length === 0){

        workList.innerHTML = `

            <tr>

                <td colspan="5">
                    登録済み作品はありません
                </td>

            </tr>

        `;

        return;

    }


    workList.innerHTML =
        works
            .map(
                function(work){

                    return `

                        <tr>

                            <td>
                                ${
                                    work.workNo ||
                                    work.id ||
                                    ""
                                }
                            </td>


                            <td>
                                ${
                                    work.title ||
                                    ""
                                }
                            </td>


                            <td>

                                ${
                                    Array.isArray(
                                        work.category
                                    )

                                        ? work.category.join(
                                            " / "
                                        )

                                        : ""

                                }

                            </td>


                            <td>
                                ${createStars(work.level)}
                            </td>


                            <td>

                                <button
                                    type="button"
                                    onclick="editWork(${work.id})"
                                >
                                    編集
                                </button>


                                <button
                                    type="button"
                                    onclick="deleteWork(${work.id})"
                                >
                                    削除
                                </button>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


// --------------------------------------
// 編集
// --------------------------------------

function editWork(id){

    if(
        typeof works === "undefined"
    ){

        return;

    }


    const work =
        works.find(
            function(item){

                return (
                    Number(item.id) ===
                    Number(id)
                );

            }
        );


    if(!work){

        alert(
            "作品が見つかりません🥲"
        );

        return;

    }


    editId =
        work.id;


    document
        .getElementById("title")
        .value =
        work.title || "";


    document
        .getElementById("description")
        .value =
        work.description || "";


    document
        .getElementById("fixedTags")
        .value =
        Array.isArray(work.fixedTags)
            ? work.fixedTags.join(", ")
            : "";


    document
        .getElementById("freeTags")
        .value =
        Array.isArray(work.freeTags)
            ? work.freeTags.join(", ")
            : "";


    document
        .getElementById("series")
        .value =
        work.series || "";


    document
        .getElementById("difficulty")
        .value =
        work.level || 1;


    document
        .getElementById("age")
        .value =
        work.age || "";


    document
        .getElementById("size")
        .value =
        work.size || "A4";


    document
        .getElementById("tools")
        .value =
        Array.isArray(work.tools)
            ? work.tools.join(", ")
            : "";


    const checkboxes =
        form.querySelectorAll(
            'input[type="checkbox"]'
        );


    checkboxes.forEach(
        function(checkbox){

            checkbox.checked =
                Array.isArray(work.category) &&
                work.category.includes(
                    checkbox.value
                );

        }
    );


    // ----------------------------------
    // 既存作品データ
    // ----------------------------------

    workData =
        Object.assign(
            createEmptyWorkData(),
            work
        );


    selectedPdfFile =
        null;


    // ----------------------------------
    // 既存サムネイル表示
    // ----------------------------------

    showThumbnail(
        work.thumbnail
    );


    updateExportArea();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// --------------------------------------
// 削除
// --------------------------------------

function deleteWork(id){

    const confirmed =
        confirm(
            "この作品を削除しますか？"
        );


    if(!confirmed){

        return;

    }


    alert(
        "現在のVersionでは、管理画面上の削除確認のみ行います。\n" +
        "GitHub上のworks.jsはまだ変更しません。"
    );

}


// --------------------------------------
// フォームリセット
// --------------------------------------

function resetForm(){

    if(form){

        form.reset();

    }


    editId =
        null;


    selectedPdfFile =
        null;


    workData =
        createEmptyWorkData();


    resetThumbnail();

    updateExportArea();

}


// --------------------------------------
// GitHub公開
// --------------------------------------

async function triggerGitHubPublish(){

    // ----------------------------------
    // 作品データ生成
    // ----------------------------------

    const data =
        saveWork();


    if(!data){

        return;

    }


    // ----------------------------------
    // PDFチェック
    // ----------------------------------

    if(
        !selectedPdfFile
    ){

        alert(
            "公開するPDFを選択してください🥹"
        );

        return;

    }


    // ----------------------------------
    // FormData作成
    // ----------------------------------

    const formData =
        new FormData();


    // ----------------------------------
    // 作品情報
    // ----------------------------------

    formData.append(
        "title",
        data.title
    );


    formData.append(
        "description",
        data.description
    );


    formData.append(
        "category",
        data.category.join(",")
    );


    formData.append(
        "fixedTags",
        data.fixedTags.join(",")
    );


    formData.append(
        "freeTags",
        data.freeTags.join(",")
    );


    formData.append(
        "series",
        data.series
    );


    formData.append(
        "level",
        String(data.level)
    );


    formData.append(
        "age",
        data.age
    );


    formData.append(
        "size",
        data.size
    );


    formData.append(
        "tools",
        data.tools.join(",")
    );


    formData.append(
        "workNo",
        data.workNo
    );


    formData.append(
        "workId",
        String(data.id)
    );


    // ----------------------------------
    // PDF
    // ----------------------------------

    formData.append(
        "pdf",
        selectedPdfFile,
        selectedPdfFile.name
    );


    // ----------------------------------
    // サムネイル
    // ----------------------------------

    try{

        const thumbnailBlob =
            await dataUrlToBlob(
                data.thumbnail
            );


        formData.append(
            "thumbnail",
            thumbnailBlob,
            `${data.workNo}.jpg`
        );

    }
    catch(error){

        console.error(
            "サムネイル変換エラー:",
            error
        );


        alert(
            "サムネイルの準備に失敗しました🥲"
        );

        return;

    }


    // ----------------------------------
    // 公開中表示
    // ----------------------------------

    if(publishButton){

        publishButton.disabled =
            true;


        publishButton.textContent =
            "🚀 公開処理中…";

    }


    try{

        console.log(
            "Cloudflare WorkerへPDF＋サムネイル＋作品情報を送信します📦"
        );


        const response =
            await fetch(

                WORKER_URL,

                {

                    method:
                        "POST",

                    body:
                        formData

                }

            );


        const result =
            await response.json();


        console.log(
            "Worker response:",
            result
        );


        if(!response.ok){

            throw new Error(

                result.error ||
                "公開処理に失敗しました"

            );

        }


        if(!result.success){

            throw new Error(

                result.error ||
                "GitHubへの保存に失敗しました"

            );

        }


        // ----------------------------------
        // 成功
        // ----------------------------------

        alert(

            "🚀 公開リクエストを送信しました！\n\n" +

            "📄 PDF\n" +

            "🖼️ サムネイル\n" +

            "📝 作品情報\n\n" +

            "をGitHubへ送信しました😊\n\n" +

            "このあとGitHub Actionsが実行されます✨"

        );


        console.log(
            "公開成功✨",
            result
        );


    }
    catch(error){

        console.error(
            "公開エラー:",
            error
        );


        alert(

            "公開処理でエラーが発生しました🥲\n\n" +

            error.message

        );

    }
    finally{

        if(publishButton){

            publishButton.disabled =
                false;


            publishButton.textContent =
                "🚀 公開";

        }

    }

}


// --------------------------------------
// Data URL → Blob
// --------------------------------------

async function dataUrlToBlob(dataUrl){

    if(
        typeof dataUrl !== "string" ||
        !dataUrl.startsWith("data:")
    ){

        throw new Error(
            "サムネイルデータが正しくありません。"
        );

    }


    const response =
        await fetch(
            dataUrl
        );


    return await response.blob();

}


// --------------------------------------
// 公開ボタン
// --------------------------------------

if(publishButton){

    publishButton.addEventListener(
        "click",
        triggerGitHubPublish
    );

}


// --------------------------------------
// 初期表示
// --------------------------------------

renderList();

updateExportArea();


console.log(
    "Project Library admin.js Version 7.4 統合完成版"
);