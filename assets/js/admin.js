// ==========================
// Project Library
// admin.js
// Version 10.0
// ==========================

// --------------------------
// API Worker
// --------------------------

const API_WORKER_URL =
    "https://project-library-api.saaachi-app.workers.dev";


// --------------------------
// 要素取得
// --------------------------

const form =
    document.getElementById("workForm");

const draftButton =
    document.querySelector(".draft");

const publishButton =
    document.querySelector(".publish");

const pdfInput =
    document.getElementById("pdfFile");

const thumbnailPreview =
    document.getElementById("thumbnailPreview");

const fixedTagChoices =
    document.getElementById("fixedTagChoices");

const freeTagChoices =
    document.getElementById("freeTagChoices");

const seriesChoices =
    document.getElementById("seriesChoices");

const fixedTagSelected =
    document.getElementById("fixedTagSelected");

const freeTagSelected =
    document.getElementById("freeTagSelected");

const seriesSelected =
    document.getElementById("seriesSelected");

const fixedTagSearch =
    document.getElementById("fixedTagSearch");

const freeTagSearch =
    document.getElementById("freeTagSearch");

const seriesSearch =
    document.getElementById("seriesSearch");

const workList =
    document.getElementById("workList");

const editIdInput =
    document.getElementById("editId");

const usePreviousDataButton =
    document.getElementById(
        "usePreviousDataButton"
    );


// --------------------------
// 状態
// --------------------------

let editId = null;

let selectedPdfFile = null;

let workData =
    createEmptyWorkData();


// --------------------------
// 空データ
// --------------------------

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

        size: "A4",

        thumbnail: "",

        watermark: true,

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


// --------------------------
// 共通関数
// --------------------------

function toArray(value){

    if(Array.isArray(value)){

        return value
            .map(
                v =>
                    String(v).trim()
            )
            .filter(Boolean);

    }

    if(!value){

        return [];

    }

    return String(value)
        .split(",")
        .map(
            v =>
                v.trim()
        )
        .filter(Boolean);

}


function uniqueArray(array){

    return [
        ...new Set(
            array
                .map(
                    v =>
                        String(v).trim()
                )
                .filter(Boolean)
        )
    ];

}


function escapeHtml(value){

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// --------------------------
// 全登録タグ取得
// --------------------------
// ※検索用
// ここでは「全件」を取得する
// --------------------------

function getAllFixedTags(){

    const tags = [];

    works.forEach(
        work => {

            if(
                Array.isArray(
                    work.fixedTags
                )
            ){

                tags.push(
                    ...work.fixedTags
                );

            }

        }
    );

    return uniqueArray(tags)
        .sort(
            (a,b) =>
                a.localeCompare(
                    b,
                    "ja"
                )
        );

}


function getAllFreeTags(){

    const tags = [];

    works.forEach(
        work => {

            if(
                Array.isArray(
                    work.freeTags
                )
            ){

                tags.push(
                    ...work.freeTags
                );

            }

        }
    );

    return uniqueArray(tags)
        .sort(
            (a,b) =>
                a.localeCompare(
                    b,
                    "ja"
                )
        );

}


function getAllSeries(){

    const series = [];

    works.forEach(
        work => {

            if(work.series){

                series.push(
                    work.series
                );

            }

        }
    );

    return uniqueArray(series)
        .sort(
            (a,b) =>
                a.localeCompare(
                    b,
                    "ja"
                )
        );

}


// --------------------------
// 最新5件取得
// --------------------------
// 直近の作品から使われたタグを
// 重複なしで最大5件取得
// --------------------------

function getRecentChoices(
    type
){

    const values = [];

    const reversedWorks =
        [...works].reverse();

    reversedWorks.forEach(
        work => {

            let items = [];

            if(type === "fixed"){

                items =
                    toArray(
                        work.fixedTags
                    );

            }

            if(type === "free"){

                items =
                    toArray(
                        work.freeTags
                    );

            }

            if(type === "series"){

                items =
                    work.series
                        ? [work.series]
                        : [];

            }

            items.forEach(
                value => {

                    if(
                        value &&
                        !values.includes(
                            value
                        )
                    ){

                        values.push(
                            value
                        );

                    }

                }
            );

        }
    );

    return values.slice(
        0,
        5
    );

}


// --------------------------
// 選択状態
// --------------------------

function isSelected(
    type,
    value
){

    if(type === "fixed"){

        return workData.fixedTags
            .includes(value);

    }

    if(type === "free"){

        return workData.freeTags
            .includes(value);

    }

    if(type === "series"){

        return workData.series === value;

    }

    return false;

}


// --------------------------
// タグ追加
// --------------------------

function addChoice(
    type,
    value
){

    if(!value){

        return;

    }

    if(type === "fixed"){

        workData.fixedTags =
            uniqueArray([
                ...workData.fixedTags,
                value
            ]);

    }

    if(type === "free"){

        workData.freeTags =
            uniqueArray([
                ...workData.freeTags,
                value
            ]);

    }

    if(type === "series"){

        workData.series =
            value;

    }

}


// --------------------------
// タグ削除
// --------------------------

function removeChoice(
    type,
    value
){

    if(type === "fixed"){

        workData.fixedTags =
            workData.fixedTags.filter(
                item =>
                    item !== value
            );

    }

    if(type === "free"){

        workData.freeTags =
            workData.freeTags.filter(
                item =>
                    item !== value
            );

    }

    if(type === "series"){

        if(
            workData.series === value
        ){

            workData.series =
                "";

        }

    }

}


// --------------------------
// 選択中表示
// --------------------------

function renderSelectedChoices(
    container,
    values,
    type
){

    if(!container){

        return;

    }

    container.innerHTML =
        "";

    if(!values.length){

        return;

    }

    values.forEach(
        value => {

            const item =
                document.createElement(
                    "span"
                );

            item.className =
                "selected-choice";

            const text =
                document.createElement(
                    "span"
                );

            text.textContent =
                value;

            const removeButton =
                document.createElement(
                    "button"
                );

            removeButton.type =
                "button";

            removeButton.textContent =
                "×";

            removeButton.title =
                "選択を解除";

            removeButton.addEventListener(
                "click",
                () => {

                    removeChoice(
                        type,
                        value
                    );

                    renderAllChoices();

                }
            );

            item.appendChild(
                text
            );

            item.appendChild(
                removeButton
            );

            container.appendChild(
                item
            );

        }
    );

}


// --------------------------
// 候補表示
// --------------------------
// 検索なし
// → 最新5件
//
// 検索あり
// → 全登録から検索
// --------------------------

function renderChoiceResults(
    container,
    allValues,
    type,
    searchText
){

    if(!container){

        return;

    }

    container.innerHTML =
        "";

    const keyword =
        String(
            searchText || ""
        )
            .trim()
            .toLowerCase();


    let values = [];


    // --------------------------
    // 検索なし
    // --------------------------

    if(!keyword){

        values =
            getRecentChoices(
                type
            );

    }

    // --------------------------
    // 検索あり
    // --------------------------

    else{

        values =
            allValues.filter(
                value =>
                    value
                        .toLowerCase()
                        .includes(
                            keyword
                        )
            );

    }


    // --------------------------
    // 該当なし
    // --------------------------

    if(!values.length){

        if(keyword){

            container.innerHTML =
                `<p class="choice-empty">
                    「${escapeHtml(keyword)}」に
                    該当するものがありません
                </p>`;

        }else{

            container.innerHTML =
                `<p class="choice-empty">
                    まだ登録されていません
                </p>`;

        }

        return;

    }


    // --------------------------
    // ボタン生成
    // --------------------------

    values.forEach(
        value => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "choice-button";

            button.textContent =
                value;


            if(
                isSelected(
                    type,
                    value
                )
            ){

                button.classList.add(
                    "selected"
                );

            }


            button.addEventListener(
                "click",
                () => {

                    if(
                        type === "series"
                    ){

                        if(
                            workData.series ===
                            value
                        ){

                            removeChoice(
                                type,
                                value
                            );

                        }else{

                            addChoice(
                                type,
                                value
                            );

                        }

                    }else{

                        if(
                            isSelected(
                                type,
                                value
                            )
                        ){

                            removeChoice(
                                type,
                                value
                            );

                        }else{

                            addChoice(
                                type,
                                value
                            );

                        }

                    }

                    renderAllChoices();

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


// --------------------------
// 全UI更新
// --------------------------

function renderAllChoices(){

    const fixedTags =
        getAllFixedTags();

    const freeTags =
        getAllFreeTags();

    const series =
        getAllSeries();


    // --------------------------
    // 選択中
    // --------------------------

    renderSelectedChoices(
        fixedTagSelected,
        workData.fixedTags,
        "fixed"
    );

    renderSelectedChoices(
        freeTagSelected,
        workData.freeTags,
        "free"
    );

    renderSelectedChoices(
        seriesSelected,
        workData.series
            ? [workData.series]
            : [],
        "series"
    );


    // --------------------------
    // 候補
    // --------------------------

    renderChoiceResults(
        fixedTagChoices,
        fixedTags,
        "fixed",
        fixedTagSearch?.value
    );

    renderChoiceResults(
        freeTagChoices,
        freeTags,
        "free",
        freeTagSearch?.value
    );

    renderChoiceResults(
        seriesChoices,
        series,
        "series",
        seriesSearch?.value
    );

}


// --------------------------
// 検索イベント
// --------------------------

if(fixedTagSearch){

    fixedTagSearch.addEventListener(
        "input",
        () => {

            renderAllChoices();

        }
    );

}


if(freeTagSearch){

    freeTagSearch.addEventListener(
        "input",
        () => {

            renderAllChoices();

        }
    );

}


if(seriesSearch){

    seriesSearch.addEventListener(
        "input",
        () => {

            renderAllChoices();

        }
    );

}


// --------------------------
// 新規作成エリア
// --------------------------

function setupNewChoiceToggle(
    buttonId,
    areaId
){

    const button =
        document.getElementById(
            buttonId
        );

    const area =
        document.getElementById(
            areaId
        );

    if(
        !button ||
        !area
    ){

        return;

    }


    button.addEventListener(
        "click",
        () => {

            area.classList.toggle(
                "open"
            );


            if(
                area.classList.contains(
                    "open"
                )
            ){

                button.textContent =
                    "− 新しいものを閉じる";

            }else{

                if(
                    buttonId ===
                    "newFixedTagToggle"
                ){

                    button.textContent =
                        "＋ 新しい固定タグを作る";

                }

                if(
                    buttonId ===
                    "newFreeTagToggle"
                ){

                    button.textContent =
                        "＋ 新しい自由タグを作る";

                }

                if(
                    buttonId ===
                    "newSeriesToggle"
                ){

                    button.textContent =
                        "＋ 新しいシリーズを作る";

                }

            }

        }
    );

}


setupNewChoiceToggle(
    "newFixedTagToggle",
    "newFixedTagArea"
);

setupNewChoiceToggle(
    "newFreeTagToggle",
    "newFreeTagArea"
);

setupNewChoiceToggle(
    "newSeriesToggle",
    "newSeriesArea"
);


// --------------------------
// 入力値
// --------------------------

function getInputValue(id){

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";

}


// --------------------------
// サムネイル表示
// --------------------------

function showThumbnail(src){

    if(!thumbnailPreview){

        return;

    }

    thumbnailPreview.innerHTML =
        "";

    if(!src){

        thumbnailPreview.innerHTML =
            `<span>
                PDFを選択すると表示されます
            </span>`;

        return;

    }

    const image =
        document.createElement(
            "img"
        );

    image.src =
        src;

    image.alt =
        "作品サムネイル";

    thumbnailPreview.appendChild(
        image
    );

}


function resetThumbnail(){

    showThumbnail("");

}


// --------------------------
// PDF.js
// --------------------------

let pdfjsLibPromise = null;


function loadPdfJs(){

    if(!pdfjsLibPromise){

        pdfjsLibPromise =
            import(
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
            )
                .then(
                    pdfjsLib => {

                        pdfjsLib
                            .GlobalWorkerOptions
                            .workerSrc =
                            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

                        return pdfjsLib;

                    }
                );

    }

    return pdfjsLibPromise;

}


// --------------------------
// PDF → サムネイル生成
// --------------------------

async function createPdfThumbnailWithWatermark(
    file
){

    const pdfjsLib =
        await loadPdfJs();

    const arrayBuffer =
        await file.arrayBuffer();

    const pdf =
        await pdfjsLib
            .getDocument({
                data:
                    arrayBuffer
            })
            .promise;

    const page =
        await pdf.getPage(1);

    const viewport =
        page.getViewport({
            scale:
                1.2
        });

    const canvas =
        document.createElement(
            "canvas"
        );

    const context =
        canvas.getContext(
            "2d"
        );

    canvas.width =
        viewport.width;

    canvas.height =
        viewport.height;

    await page.render({
        canvasContext:
            context,
        viewport:
            viewport
    }).promise;


    // --------------------------
    // 透かし
    // --------------------------

    context.save();

    context.globalAlpha =
        0.16;

    context.fillStyle =
        "#777";

    context.font =
        "bold 26px sans-serif";

    context.textAlign =
        "center";

    context.textBaseline =
        "middle";

    const text =
        "Project Library";

    const text2 =
        "無料プリント";

    context.rotate(
        -25 * Math.PI / 180
    );


    for(
        let y =
            -canvas.height;
        y <
            canvas.height * 2;
        y += 150
    ){

        for(
            let x =
                -canvas.width;
            x <
                canvas.width * 2;
            x += 260
        ){

            context.fillText(
                text,
                x,
                y
            );

            context.fillText(
                text2,
                x,
                y + 34
            );

        }

    }

    context.restore();


    return canvas.toDataURL(
        "image/jpeg",
        0.82
    );

}


// --------------------------
// PDF選択
// --------------------------

if(pdfInput){

    pdfInput.addEventListener(
        "change",
        async () => {

            const file =
                pdfInput.files?.[0];

            if(!file){

                return;

            }

            selectedPdfFile =
                file;

            workData.pdf =
                file;


            showThumbnail("");


            if(thumbnailPreview){

                thumbnailPreview.innerHTML =
                    `<span>
                        サムネイル作成中…🥹
                    </span>`;

            }


            try{

                const thumbnail =
                    await createPdfThumbnailWithWatermark(
                        file
                    );

                workData.thumbnail =
                    thumbnail;

                showThumbnail(
                    thumbnail
                );

            }catch(error){

                console.error(
                    "サムネイル生成エラー:",
                    error
                );

                alert(
                    "PDFからサムネイルを作成できませんでした🥲"
                );

                resetThumbnail();

            }

        }
    );

}


// --------------------------
// カテゴリ取得
// --------------------------

function getSelectedCategories(){

    if(!form){

        return [];

    }

    return [
        ...form.querySelectorAll(
            'input[type="checkbox"][data-category]:checked'
        )
    ]
        .map(
            input =>
                input.value
        )
        .filter(Boolean);

}


// --------------------------
// フォームデータ取得
// --------------------------

function collectFormData(){

    const title =
        document.getElementById(
            "title"
        )?.value.trim() || "";


    const description =
        document.getElementById(
            "description"
        )?.value.trim() || "";


    const level =
        Number(
            document.getElementById(
                "difficulty"
            )?.value || 1
        );


    const size =
        document.getElementById(
            "size"
        )?.value || "A4";


    // --------------------------
    // 新規タグ
    // --------------------------

    const newFixedTags =
        toArray(
            getInputValue(
                "newFixedTag"
            )
        );


    const newFreeTags =
        toArray(
            getInputValue(
                "newFreeTag"
            )
        );


    const newSeries =
        getInputValue(
            "newSeries"
        );


    // --------------------------
    // 新規タグを追加
    // --------------------------

    if(newFixedTags.length){

        workData.fixedTags =
            uniqueArray([
                ...workData.fixedTags,
                ...newFixedTags
            ]);

    }


    if(newFreeTags.length){

        workData.freeTags =
            uniqueArray([
                ...workData.freeTags,
                ...newFreeTags
            ]);

    }


    if(newSeries){

        workData.series =
            newSeries;

    }


    return {

        title,

        description,

        category:
            getSelectedCategories(),

        fixedTags:
            uniqueArray(
                workData.fixedTags
            ),

        freeTags:
            uniqueArray(
                workData.freeTags
            ),

        series:
            workData.series || "",

        level,

        size,

        thumbnail:
            workData.thumbnail || "",

        pdf:
            selectedPdfFile ||
            workData.pdf ||
            "",

        author:
            "あたまのストレッチ",

        status:
            "public"

    };

}


// --------------------------
// バリデーション
// --------------------------

function validateForm(data){

    if(!data.title){

        alert(
            "作品タイトルを入力してください🥹"
        );

        return false;

    }


    if(!data.category.length){

        alert(
            "カテゴリを1つ以上選択してください🥹"
        );

        return false;

    }


    if(
        !editId &&
        !selectedPdfFile
    ){

        alert(
            "PDFファイルを選択してください🥹"
        );

        return false;

    }


    if(
        !editId &&
        !data.thumbnail
    ){

        alert(
            "PDFからサムネイルを作成してください🥹"
        );

        return false;

    }


    return true;

}


// --------------------------
// 次の作品ID
// --------------------------

function getNextWorkId(){

    if(!works.length){

        return 1;

    }

    return Math.max(
        ...works.map(
            work =>
                Number(work.id) || 0
        )
    ) + 1;

}


// --------------------------
// 次の作品番号
// --------------------------

function getNextWorkNo(){

    if(!works.length){

        return "PL-000001";

    }

    const maxNo =
        Math.max(
            ...works.map(
                work => {

                    const match =
                        String(
                            work.workNo || ""
                        ).match(
                            /(\d+)$/
                        );

                    return match
                        ? Number(
                            match[1]
                        )
                        : 0;

                }
            )
        );

    return `PL-${String(
        maxNo + 1
    ).padStart(
        6,
        "0"
    )}`;

}


// --------------------------
// 作品データ生成
// --------------------------

function generateWorkData(){

    const data =
        collectFormData();


    if(!validateForm(data)){

        return null;

    }


    const now =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );


    const existing =
        editId
            ? works.find(
                work =>
                    Number(work.id) ===
                    Number(editId)
            )
            : null;


    workData = {

        id:
            existing?.id ??
            getNextWorkId(),

        workNo:
            existing?.workNo ??
            getNextWorkNo(),

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

        size:
            data.size,

        thumbnail:
            data.thumbnail,

        watermark:
            true,

        pdf:
            selectedPdfFile
                ? selectedPdfFile
                : (
                    existing?.pdf ??
                    data.pdf ??
                    ""
                ),

        recommend:
            existing?.recommend ??
            false,

        isNew:
            true,

        publishDate:
            existing?.publishDate ??
            now,

        updateDate:
            now,

        etsy:
            existing?.etsy ??
            "",

        related:
            existing?.related ??
            [],

        author:
            "あたまのストレッチ",

        status:
            "public"

    };


    return workData;

}


// --------------------------
// 保存
// --------------------------

function saveWork(){

    const data =
        generateWorkData();


    if(!data){

        return null;

    }


    workData =
        data;


    return data;

}


// --------------------------
// 公開
// --------------------------

async function triggerGitHubPublish(){

    const data =
        saveWork();


    if(!data){

        return;

    }


    // --------------------------
    // 新規投稿
    // --------------------------

    if(
        !editId &&
        !selectedPdfFile
    ){

        alert(
            "PDFファイルを選択してください🥹"
        );

        return;

    }


    // --------------------------
    // 現在のWorker仕様では
    // PDFが必要
    // --------------------------

    if(!selectedPdfFile){

        alert(
            "現在の公開処理ではPDFファイルが必要です。\n編集する場合も、いったんPDFを再選択してください🙏"
        );

        return;

    }


    try{

        publishButton.disabled =
            true;

        publishButton.textContent =
            "🚀 公開処理中…";


        const formData =
            new FormData();


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
            JSON.stringify(
                data.category
            )
        );


        formData.append(
            "fixedTags",
            JSON.stringify(
                data.fixedTags
            )
        );


        formData.append(
            "freeTags",
            JSON.stringify(
                data.freeTags
            )
        );


        formData.append(
            "series",
            data.series
        );


        formData.append(
            "level",
            String(
                data.level
            )
        );


        formData.append(
            "size",
            data.size
        );


        formData.append(
            "workNo",
            data.workNo
        );


        formData.append(
            "workId",
            String(
                data.id
            )
        );


        formData.append(
            "pdf",
            selectedPdfFile
        );


        // --------------------------
        // 自動生成サムネイル
        // --------------------------

        const thumbnailBlob =
            dataUrlToBlob(
                data.thumbnail
            );


        if(!thumbnailBlob){

            throw new Error(
                "サムネイルの作成に失敗しました。"
            );

        }


        formData.append(
            "thumbnail",
            thumbnailBlob,
            `${data.title}.jpg`
        );


        // --------------------------
        // Worker
        // --------------------------

        const response =
            await fetch(
                API_WORKER_URL,
                {
                    method:
                        "POST",
                    body:
                        formData
                }
            );


        const result =
            await response
                .json()
                .catch(
                    () => ({})
                );


        if(!response.ok){

            throw new Error(
                result.error ||
                `HTTP ${response.status}`
            );

        }


        alert(
            "作品を追加しました😊✨\n\nGitHub Actionsで公開処理が始まります🚀"
        );


        resetForm();


    }catch(error){

        console.error(
            "公開エラー:",
            error
        );


        alert(
            `公開に失敗しました🥲\n\n${error.message}`
        );


    }finally{

        publishButton.disabled =
            false;

        publishButton.textContent =
            editId
                ? "🚀 更新する"
                : "🚀 公開する";

    }

}


// --------------------------
// Data URL → Blob
// --------------------------

function dataUrlToBlob(
    dataUrl
){

    if(!dataUrl){

        return null;

    }


    const parts =
        dataUrl.split(",");


    if(parts.length < 2){

        return null;

    }


    const mimeMatch =
        parts[0].match(
            /:(.*?);/
        );


    const mime =
        mimeMatch
            ? mimeMatch[1]
            : "image/jpeg";


    const binary =
        atob(
            parts[1]
        );


    const bytes =
        new Uint8Array(
            binary.length
        );


    for(
        let i = 0;
        i < binary.length;
        i++
    ){

        bytes[i] =
            binary.charCodeAt(i);

    }


    return new Blob(
        [bytes],
        {
            type:
                mime
        }
    );

}


// ==================================================
// 前回データ
// ==================================================


// --------------------------
// 直前の作品を取得
// --------------------------
// 基本は works.js の最後の作品。
// ただし公開日・更新日がある場合は
// 日付を比較して最新を優先。
// --------------------------

function getPreviousWork(){

    if(!works.length){

        return null;

    }


    const sorted =
        [...works].sort(
            (a,b) => {

                const dateA =
                    String(
                        a.updateDate ||
                        a.publishDate ||
                        ""
                    );

                const dateB =
                    String(
                        b.updateDate ||
                        b.publishDate ||
                        ""
                    );


                if(dateA !== dateB){

                    return dateB.localeCompare(
                        dateA
                    );

                }


                return (
                    Number(b.id) || 0
                ) -
                (
                    Number(a.id) || 0
                );

            }
        );


    return sorted[0] || null;

}


// --------------------------
// 前回データを反映
// --------------------------

function usePreviousWork(){

    const previousWork =
        getPreviousWork();


    if(!previousWork){

        alert(
            "まだ登録済みの作品がありません🥹"
        );

        return;

    }


    // --------------------------
    // 新規投稿状態に戻す
    // --------------------------

    editId =
        null;

    if(editIdInput){

        editIdInput.value =
            "";

    }


    selectedPdfFile =
        null;


    // --------------------------
    // データをコピー
    // --------------------------
    // PDF・サムネイルは
    // 絶対にコピーしない
    // --------------------------

    workData = {

        ...createEmptyWorkData(),

        title:
            previousWork.title || "",

        description:
            previousWork.description || "",

        category:
            toArray(
                previousWork.category
            ),

        fixedTags:
            toArray(
                previousWork.fixedTags
            ),

        freeTags:
            toArray(
                previousWork.freeTags
            ),

        series:
            previousWork.series || "",

        level:
            Number(
                previousWork.level
            ) || 1,

        size:
            previousWork.size ||
            "A4",

        // ----------------------
        // PDFはコピーしない
        // ----------------------

        pdf:
            "",

        // ----------------------
        // サムネイルもコピーしない
        // ----------------------

        thumbnail:
            "",

        watermark:
            true,

        recommend:
            false,

        isNew:
            true,

        publishDate:
            "",

        updateDate:
            "",

        etsy:
            "",

        related:
            [],

        author:
            "あたまのストレッチ",

        status:
            "public"

    };


    // --------------------------
    // タイトル
    // --------------------------

    document.getElementById(
        "title"
    ).value =
        workData.title;


    // --------------------------
    // 説明
    // --------------------------

    document.getElementById(
        "description"
    ).value =
        workData.description;


    // --------------------------
    // 難易度
    // --------------------------

    document.getElementById(
        "difficulty"
    ).value =
        String(
            workData.level
        );


    // --------------------------
    // サイズ
    // --------------------------

    document.getElementById(
        "size"
    ).value =
        workData.size;


    // --------------------------
    // 新規入力欄を空にする
    // --------------------------

    document.getElementById(
        "newFixedTag"
    ).value =
        "";

    document.getElementById(
        "newFreeTag"
    ).value =
        "";

    document.getElementById(
        "newSeries"
    ).value =
        "";


    // --------------------------
    // カテゴリ
    // --------------------------

    form
        .querySelectorAll(
            'input[type="checkbox"][data-category]'
        )
        .forEach(
            input => {

                input.checked =
                    workData.category
                        .includes(
                            input.value
                        );

            }
        );


    // --------------------------
    // 検索欄をクリア
    // --------------------------

    if(fixedTagSearch){

        fixedTagSearch.value =
            "";

    }

    if(freeTagSearch){

        freeTagSearch.value =
            "";

    }

    if(seriesSearch){

        seriesSearch.value =
            "";

    }


    // --------------------------
    // PDF入力を空にする
    // --------------------------

    if(pdfInput){

        pdfInput.value =
            "";

    }


    // --------------------------
    // サムネイルを空にする
    // --------------------------

    resetThumbnail();


    // --------------------------
    // UI更新
    // --------------------------

    renderAllChoices();


    if(publishButton){

        publishButton.textContent =
            "🚀 公開する";

    }


    // --------------------------
    // タイトル欄へ移動
    // --------------------------

    window.scrollTo({

        top:
            0,

        behavior:
            "smooth"

    });


    // --------------------------
    // タイトルを選択
    // --------------------------

    setTimeout(
        () => {

            const titleInput =
                document.getElementById(
                    "title"
                );

            if(titleInput){

                titleInput.focus();

                titleInput.select();

            }

        },
        400
    );


    alert(
        `「${previousWork.title}」のデータを反映しました😊\n\nタイトルを変更して、PDFを選択すれば新しい作品として公開できます✨`
    );

}


// --------------------------
// 前回データボタン
// --------------------------

if(usePreviousDataButton){

    usePreviousDataButton.addEventListener(
        "click",
        () => {

            usePreviousWork();

        }
    );

}


// ==================================================
// 作品一覧
// ==================================================

function renderList(){

    if(!workList){

        return;

    }


    workList.innerHTML =
        "";


    if(!works.length){

        workList.innerHTML =
            `<tr>
                <td colspan="5">
                    まだ作品がありません。
                </td>
            </tr>`;

        return;

    }


    works.forEach(
        work => {

            const row =
                document.createElement(
                    "tr"
                );


            const categories =
                Array.isArray(
                    work.category
                )
                    ? work.category.join(
                        " / "
                    )
                    : (
                        work.category ||
                        ""
                    );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        work.workNo || ""
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        work.title || ""
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        categories
                    )}
                </td>

                <td>
                    ${"★".repeat(
                        Number(
                            work.level
                        ) || 1
                    )}
                </td>

                <td>

                    <button
                        type="button"
                        class="edit-work-button"
                        data-id="${work.id}"
                    >
                        ✏️ 編集
                    </button>

                    <button
                        type="button"
                        class="delete-work-button"
                        data-id="${work.id}"
                    >
                        🗑️ 削除
                    </button>

                </td>

            `;


            workList.appendChild(
                row
            );

        }
    );


    // --------------------------
    // 編集
    // --------------------------

    workList
        .querySelectorAll(
            ".edit-work-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        editWork(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    // --------------------------
    // 削除
    // --------------------------

    workList
        .querySelectorAll(
            ".delete-work-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteWork(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


// ==================================================
// 編集
// ==================================================

function editWork(id){

    const work =
        works.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if(!work){

        alert(
            "作品が見つかりません🥲"
        );

        return;

    }


    editId =
        work.id;


    if(editIdInput){

        editIdInput.value =
            work.id;

    }


    workData = {

        ...createEmptyWorkData(),

        ...work,

        category:
            toArray(
                work.category
            ),

        fixedTags:
            toArray(
                work.fixedTags
            ),

        freeTags:
            toArray(
                work.freeTags
            )

    };


    selectedPdfFile =
        null;


    // --------------------------
    // 入力欄
    // --------------------------

    document.getElementById(
        "title"
    ).value =
        work.title || "";


    document.getElementById(
        "description"
    ).value =
        work.description || "";


    document.getElementById(
        "difficulty"
    ).value =
        work.level || 1;


    document.getElementById(
        "size"
    ).value =
        work.size || "A4";


    document.getElementById(
        "newFixedTag"
    ).value =
        "";


    document.getElementById(
        "newFreeTag"
    ).value =
        "";


    document.getElementById(
        "newSeries"
    ).value =
        "";


    // --------------------------
    // カテゴリ
    // --------------------------

    form
        .querySelectorAll(
            'input[type="checkbox"][data-category]'
        )
        .forEach(
            input => {

                input.checked =
                    workData.category
                        .includes(
                            input.value
                        );

            }
        );


    // --------------------------
    // 検索欄
    // --------------------------

    if(fixedTagSearch){

        fixedTagSearch.value =
            "";

    }


    if(freeTagSearch){

        freeTagSearch.value =
            "";

    }


    if(seriesSearch){

        seriesSearch.value =
            "";

    }


    // --------------------------
    // 選択状態
    // --------------------------

    renderAllChoices();


    // --------------------------
    // サムネイル
    // --------------------------

    if(work.thumbnail){

        showThumbnail(
            work.thumbnail
        );

    }else{

        resetThumbnail();

    }


    // --------------------------
    // PDF
    // --------------------------

    if(pdfInput){

        pdfInput.value =
            "";

    }


    // --------------------------
    // ボタン
    // --------------------------

    if(publishButton){

        publishButton.textContent =
            "🚀 更新する";

    }


    window.scrollTo({

        top:
            0,

        behavior:
            "smooth"

    });

}


// ==================================================
// 削除
// ==================================================

function deleteWork(id){

    const work =
        works.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if(!work){

        alert(
            "作品が見つかりません🥲"
        );

        return;

    }


    const confirmed =
        confirm(
            `「${work.title}」を削除しますか？\n\n※現在は管理画面上の確認のみです。GitHub上の作品ファイルはまだ削除されません。`
        );


    if(!confirmed){

        return;

    }


    alert(
        "削除機能は次の段階でGitHubまで連動させます🙏"
    );

}


// ==================================================
// フォームリセット
// ==================================================

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


    if(editIdInput){

        editIdInput.value =
            "";

    }


    // --------------------------
    // 検索欄
    // --------------------------

    if(fixedTagSearch){

        fixedTagSearch.value =
            "";

    }


    if(freeTagSearch){

        freeTagSearch.value =
            "";

    }


    if(seriesSearch){

        seriesSearch.value =
            "";

    }


    // --------------------------
    // 新規入力
    // --------------------------

    [
        "newFixedTagArea",
        "newFreeTagArea",
        "newSeriesArea"
    ]
        .forEach(
            id => {

                const area =
                    document.getElementById(
                        id
                    );

                if(area){

                    area.classList.remove(
                        "open"
                    );

                }

            }
        );


    if(
        document.getElementById(
            "newFixedTagToggle"
        )
    ){

        document.getElementById(
            "newFixedTagToggle"
        ).textContent =
            "＋ 新しい固定タグを作る";

    }


    if(
        document.getElementById(
            "newFreeTagToggle"
        )
    ){

        document.getElementById(
            "newFreeTagToggle"
        ).textContent =
            "＋ 新しい自由タグを作る";

    }


    if(
        document.getElementById(
            "newSeriesToggle"
        )
    ){

        document.getElementById(
            "newSeriesToggle"
        ).textContent =
            "＋ 新しいシリーズを作る";

    }


    resetThumbnail();

    renderAllChoices();


    if(publishButton){

        publishButton.textContent =
            "🚀 公開する";

    }

}


// ==================================================
// 下書き
// ==================================================

if(draftButton){

    draftButton.addEventListener(
        "click",
        () => {

            const data =
                generateWorkData();


            if(!data){

                return;

            }


            data.status =
                "draft";


            alert(
                "下書きデータを作成しました😊\n\n※現在はブラウザ上での準備のみです。GitHubには公開されません。"
            );

        }
    );

}


// ==================================================
// 公開
// ==================================================

if(publishButton){

    publishButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            triggerGitHubPublish();

        }
    );

}


// ==================================================
// 初期表示
// ==================================================

renderAllChoices();

renderList();


// ==================================================
// 起動ログ
// ==================================================

console.log(
    "Project Library admin.js Version 10.0"
);