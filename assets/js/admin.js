// ======================================
// Project Library
// admin.js
// Version 7.0
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

const thumbnailInput =
    document.getElementById("thumbnail");

const pdfInput =
    document.getElementById("pdf");

const preview =
    document.querySelector(".thumbnail-preview");

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
// Cloudflare Worker
// GitHub Actions接続用
// ======================================
//
// このURLへ admin.js から
// 作品データを送信します。
//
// ※ Cloudflare Workerを公開したときの
// URLを使用しています。
//

const WORKER_URL =
    "https://project-library.saaachi-app.workers.dev";


// ======================================
// 投稿データ初期値
// ======================================

function createEmptyWorkData(){

    return {

        id: null,

        workNo: "",

        title: "",

        category: [],

        fixedTags: [],

        freeTags: [],

        series: "",

        level: 1,

        age: "",

        size: "A4",

        tools: [],

        description: "",

        thumbnail: "",

        pdf: "",

        isNew: true,

        recommend: false,

        publishDate: "",

        updateDate: "",

        etsy: "",

        related: []

    };

}


// ======================================
// 投稿データ
// ======================================

let workData =
    createEmptyWorkData();


// ======================================
// 難易度表示
// ======================================

function createStars(level){

    switch(level){

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

                workData.thumbnail = "";

                resetThumbnail();

                return;

            }

            const reader =
                new FileReader();

            reader.onload =
                function(e){

                    workData.thumbnail =
                        e.target.result;

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
        async function(){

            const file =
                this.files[0];

            if(!file){
                return;
            }

            workData.pdf =
                file;

            console.log(
                "PDF選択：",
                file.name
            );

            try{

                const thumbnail =
                    await createThumbnail(file);

                if(thumbnail){

                    workData.thumbnail =
                        thumbnail;

                    showThumbnail(
                        thumbnail
                    );

                }

            }catch(error){

                console.error(
                    "PDFサムネイル生成エラー:",
                    error
                );

                alert(
                    "PDFのサムネイル生成に失敗しました🥲"
                );

            }

        }
    );

}


// ======================================
// PDFサムネイル生成
// ======================================

async function createThumbnail(file){

    if(typeof pdfjsLib === "undefined"){

        console.warn(
            "pdf.js が読み込まれていません"
        );

        return null;

    }

    const arrayBuffer =
        await file.arrayBuffer();

    const pdf =
        await pdfjsLib.getDocument({
            data: arrayBuffer
        }).promise;

    const page =
        await pdf.getPage(1);

    const viewport =
        page.getViewport({
            scale: 1.5
        });

    const canvas =
        document.createElement("canvas");

    const context =
        canvas.getContext("2d");

    canvas.width =
        viewport.width;

    canvas.height =
        viewport.height;

    await page.render({

        canvasContext: context,

        viewport: viewport

    }).promise;

    return canvas.toDataURL(
        "image/jpeg"
    );

}
// ======================================
// 一覧表示
// ======================================

function renderList(){

    if(!workList){
        return;
    }

    let html = "";

    works.forEach(work => {

        html += `
            <tr>

                <td>
                    ${work.workNo || ""}
                </td>

                <td>
                    ${work.title || ""}
                </td>

                <td>
                    ${
                        Array.isArray(work.category)
                            ? work.category.join("・")
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

    });

    workList.innerHTML =
        html;

}


// ======================================
// 編集
// ======================================

function editWork(id){

    const work =
        works.find(
            item => item.id === id
        );

    if(!work){
        return;
    }

    editId =
        id;

    workData =
        structuredClone(work);


    // ------------------------------
    // フォームへ反映
    // ------------------------------

    document.getElementById("title").value =
        workData.title || "";

    document.getElementById("fixedTags").value =
        Array.isArray(workData.fixedTags)
            ? workData.fixedTags.join(",")
            : "";

    document.getElementById("freeTags").value =
        Array.isArray(workData.freeTags)
            ? workData.freeTags.join(",")
            : "";

    document.getElementById("series").value =
        workData.series || "";

    document.getElementById("difficulty").value =
        workData.level || 1;

    document.getElementById("age").value =
        workData.age || "";

    document.getElementById("size").value =
        workData.size || "A4";

    document.getElementById("tools").value =
        Array.isArray(workData.tools)
            ? workData.tools.join(",")
            : "";

    document.getElementById("description").value =
        workData.description || "";


    // ------------------------------
    // カテゴリ
    // ------------------------------

    document
        .querySelectorAll(
            '.check-group input[type="checkbox"]'
        )
        .forEach(box => {

            box.checked =
                Array.isArray(workData.category) &&
                workData.category.includes(
                    box.value
                );

        });


    // ------------------------------
    // サムネイル
    // ------------------------------

    if(workData.thumbnail){

        showThumbnail(
            workData.thumbnail
        );

    }else{

        resetThumbnail();

    }


    // ------------------------------
    // ボタン変更
    // ------------------------------

    publishButton.textContent =
        "更新する";


    // ------------------------------
    // ページ上部へ
    // ------------------------------

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ======================================
// 削除
// ======================================

function deleteWork(id){

    const work =
        works.find(
            item => item.id === id
        );

    if(!work){
        return;
    }


    const ok =
        confirm(
            `「${work.title}」を削除しますか？`
        );

    if(!ok){
        return;
    }


    const index =
        works.findIndex(
            item => item.id === id
        );


    if(index !== -1){

        works.splice(
            index,
            1
        );

    }


    if(editId === id){

        resetForm();

    }


    renderList();

    updateExportArea();

}


// ======================================
// フォーム内容取得
// ======================================

function collectFormData(){

    // ------------------------------
    // タイトル
    // ------------------------------

    workData.title =
        document
            .getElementById("title")
            .value
            .trim();


    // ------------------------------
    // 固定タグ
    // ------------------------------

    workData.fixedTags =
        document
            .getElementById("fixedTags")
            .value
            .split(",")
            .map(
                tag => tag.trim()
            )
            .filter(
                tag => tag
            );


    // ------------------------------
    // 自由タグ
    // ------------------------------

    workData.freeTags =
        document
            .getElementById("freeTags")
            .value
            .split(",")
            .map(
                tag => tag.trim()
            )
            .filter(
                tag => tag
            );


    // ------------------------------
    // シリーズ
    // ------------------------------

    workData.series =
        document
            .getElementById("series")
            .value
            .trim();


    // ------------------------------
    // 難易度
    // ------------------------------

    workData.level =
        Number(
            document
                .getElementById("difficulty")
                .value
        );


    // ------------------------------
    // 対象年齢
    // ------------------------------

    workData.age =
        document
            .getElementById("age")
            .value
            .trim();


    // ------------------------------
    // 印刷サイズ
    // ------------------------------

    workData.size =
        document
            .getElementById("size")
            .value;


    // ------------------------------
    // 必要な道具
    // ------------------------------

    workData.tools =
        document
            .getElementById("tools")
            .value
            .split(",")
            .map(
                tool => tool.trim()
            )
            .filter(
                tool => tool
            );


    // ------------------------------
    // 説明
    // ------------------------------

    workData.description =
        document
            .getElementById("description")
            .value
            .trim();


    // ------------------------------
    // カテゴリ
    // ------------------------------

    workData.category = [];


    document
        .querySelectorAll(
            '.check-group input[type="checkbox"]:checked'
        )
        .forEach(box => {

            workData.category.push(
                box.value
            );

        });

}


// ======================================
// 入力チェック
// ======================================

function validateForm(){

    collectFormData();


    // ------------------------------
    // タイトル
    // ------------------------------

    if(workData.title === ""){

        alert(
            "タイトルを入力してください。"
        );

        return false;

    }


    // ------------------------------
    // カテゴリ
    // ------------------------------

    if(
        workData.category.length === 0
    ){

        alert(
            "カテゴリを選択してください。"
        );

        return false;

    }


    // ------------------------------
    // 説明
    // ------------------------------

    if(workData.description === ""){

        alert(
            "説明を入力してください。"
        );

        return false;

    }


    return true;

}
// ======================================
// 作品データ生成
// ======================================

function generateWorkData(){

    collectFormData();

    const today =
        new Date()
            .toISOString()
            .slice(0, 10);


    // ==================================
    // 編集の場合
    // ==================================

    if(editId){

        const oldWork =
            works.find(
                item => item.id === editId
            );

        if(!oldWork){

            throw new Error(
                "編集対象の作品が見つかりません。"
            );

        }


        workData.id =
            oldWork.id;

        workData.workNo =
            oldWork.workNo;


        // サムネイル
        workData.thumbnail =
            workData.thumbnail ||
            oldWork.thumbnail ||
            "";


        // PDF
        workData.pdf =
            workData.pdf ||
            oldWork.pdf ||
            "";


        // 日付
        workData.publishDate =
            oldWork.publishDate || today;

        workData.updateDate =
            today;


        // その他の既存情報
        workData.isNew =
            oldWork.isNew ?? false;

        workData.recommend =
            oldWork.recommend ?? false;

        workData.etsy =
            oldWork.etsy || "";

        workData.related =
            Array.isArray(oldWork.related)
                ? oldWork.related
                : [];

    }


    // ==================================
    // 新規作品の場合
    // ==================================

    else{

        workData.id =
            Date.now();


        workData.workNo =
            "PL-" +
            String(
                works.length + 1
            ).padStart(6, "0");


        workData.publishDate =
            today;

        workData.updateDate =
            today;

        workData.isNew =
            true;

        workData.recommend =
            false;

        workData.etsy =
            "";

        workData.related =
            [];

    }


    return structuredClone(
        workData
    );

}


// ======================================
// 保存
// ======================================

function saveWork(newWork){

    if(editId){

        const index =
            works.findIndex(
                item => item.id === editId
            );


        if(index === -1){

            throw new Error(
                "更新対象の作品が見つかりません。"
            );

        }


        works[index] =
            newWork;


        alert(
            "作品を更新しました😊"
        );

    }


    else{

        works.unshift(
            newWork
        );


        alert(
            "作品を追加しました😊"
        );

    }

}


// ======================================
// フォーム初期化
// ======================================

function resetForm(){

    editId = null;


    if(form){

        form.reset();

    }


    resetThumbnail();


    if(publishButton){

        publishButton.textContent =
            "🚀 公開する（GitHub）";

    }


    workData =
        createEmptyWorkData();

}


// ======================================
// works.js形式へ変換
// ======================================

function exportWorkData(){

    return `const works = ${JSON.stringify(
        works,
        null,
        4
    )};`;

}


// ======================================
// 出力欄更新
// ======================================

function updateExportArea(){

    if(!exportArea){

        return;

    }


    exportArea.value =
        exportWorkData();

}


// ======================================
// コピー
// ======================================

if(copyButton){

    copyButton.addEventListener(
        "click",
        async function(){

            try{

                await navigator.clipboard.writeText(
                    exportArea.value
                );


                copyButton.textContent =
                    "✅ コピーしました！";


                if(copyMessage){

                    copyMessage.textContent =
                        "works.js用データをコピーしました😊";

                }


                setTimeout(
                    () => {

                        copyButton.textContent =
                            "📋 コピー";

                        if(copyMessage){

                            copyMessage.textContent =
                                "";

                        }

                    },
                    2000
                );

            }


            catch(error){

                console.error(
                    "コピーエラー:",
                    error
                );


                alert(
                    "コピーに失敗しました🥲"
                );

            }

        }
    );

}


// ======================================
// Cloudflare Workerへ送信
// ======================================
// Version 7.0
//
// admin.html
// ↓
// admin.js
// ↓
// Cloudflare Worker
// ↓
// GitHub Actions
//
// ここで実際にWorkerへPOSTします。
// ======================================

async function triggerGitHubPublish(work){

    const body = {

        title:
            work.title || "",

        category:
            Array.isArray(work.category)
                ? work.category.join(",")
                : "",

        fixedTags:
            Array.isArray(work.fixedTags)
                ? work.fixedTags.join(",")
                : "",

        freeTags:
            Array.isArray(work.freeTags)
                ? work.freeTags.join(",")
                : ""

    };


    console.log(
        "Cloudflare Workerへ送信:",
        body
    );


    const response =
        await fetch(
            WORKER_URL,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        body
                    )

            }
        );


    // ==================================
    // HTTPエラー
    // ==================================

    if(!response.ok){

        const errorText =
            await response.text();

        console.error(
            "Workerエラー:",
            errorText
        );


        throw new Error(
            `Cloudflare Worker error: ${response.status}`
        );

    }


    // ==================================
    // Workerからの結果
    // ==================================

    const result =
        await response.json();


    console.log(
        "Cloudflare Worker response:",
        result
    );


    if(!result.success){

        throw new Error(
            result.error ||
            "GitHub Actionsの起動に失敗しました。"
        );

    }


    return result;

}
// ======================================
// 公開・更新
// ======================================

if(publishButton){

    publishButton.addEventListener(
        "click",
        async function(){

            // ------------------------------
            // 入力チェック
            // ------------------------------

            if(!validateForm()){

                return;

            }


            // ------------------------------
            // ボタンをロック
            // ------------------------------

            publishButton.disabled =
                true;

            publishButton.textContent =
                "公開中...";


            try{

                // --------------------------
                // 作品データ生成
                // --------------------------

                const newWork =
                    generateWorkData();


                // --------------------------
                // Cloudflare Workerへ送信
                // --------------------------

                await triggerGitHubPublish(
                    newWork
                );


                // --------------------------
                // ローカルの作品データ更新
                // --------------------------

                saveWork(
                    newWork
                );


                // --------------------------
                // works.js出力更新
                // --------------------------

                updateExportArea();


                // --------------------------
                // 一覧更新
                // --------------------------

                renderList();


                // --------------------------
                // 完了メッセージ
                // --------------------------

                alert(
                    "🚀 公開リクエストを送信しました！\n\nGitHub Actionsが実行されます😊"
                );


                // --------------------------
                // フォーム初期化
                // --------------------------

                resetForm();

            }


            catch(error){

                console.error(
                    "公開処理エラー:",
                    error
                );


                alert(
                    "公開処理でエラーが発生しました🥲\n\n" +
                    error.message
                );

            }


            finally{

                publishButton.disabled =
                    false;

                publishButton.textContent =
                    "🚀 公開する（GitHub）";

            }

        }
    );

}


// ======================================
// 下書き保存
// ======================================

if(draftButton){

    draftButton.addEventListener(
        "click",
        function(){

            alert(
                "下書き保存はVersion6.3以降で実装予定です😊"
            );

        }
    );

}


// ======================================
// 初回表示
// ======================================

resetForm();

renderList();

updateExportArea();


// ======================================
// Version表示
// ======================================

console.log(
    "Project Library admin.js Version 7.0"
);