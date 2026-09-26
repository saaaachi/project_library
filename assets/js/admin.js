/* ======================================
   Project Library
   admin.js
   Version 13.1
   ====================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){

        /* ==================================
           基本要素
           ================================== */

        const form =
            document.getElementById(
                "workForm"
            );

        const titleInput =
            document.getElementById(
                "title"
            );

        const pdfFileInput =
            document.getElementById(
                "pdfFile"
            );

        const thumbnailPreview =
            document.getElementById(
                "thumbnailPreview"
            );

        const difficultyInput =
            document.getElementById(
                "difficulty"
            );

        const sizeInput =
            document.getElementById(
                "size"
            );

        const descriptionInput =
            document.getElementById(
                "description"
            );

        const editIdInput =
            document.getElementById(
                "editId"
            );


        /* ==================================
           前回データ
           ================================== */

        const usePreviousDataButton =
            document.getElementById(
                "usePreviousDataButton"
            );


        /* ==================================
           カテゴリ
           ================================== */

        const categoryInputs =
            document.querySelectorAll(
                "[data-category]"
            );


        /* ==================================
           タグ・シリーズ
           ================================== */

        const fixedTagSearch =
            document.getElementById(
                "fixedTagSearch"
            );

        const fixedTagChoices =
            document.getElementById(
                "fixedTagChoices"
            );

        const fixedTagSelected =
            document.getElementById(
                "fixedTagSelected"
            );

        const newFixedTagToggle =
            document.getElementById(
                "newFixedTagToggle"
            );

        const newFixedTagArea =
            document.getElementById(
                "newFixedTagArea"
            );

        const newFixedTag =
            document.getElementById(
                "newFixedTag"
            );


        const freeTagSearch =
            document.getElementById(
                "freeTagSearch"
            );

        const freeTagChoices =
            document.getElementById(
                "freeTagChoices"
            );

        const freeTagSelected =
            document.getElementById(
                "freeTagSelected"
            );

        const newFreeTagToggle =
            document.getElementById(
                "newFreeTagToggle"
            );

        const newFreeTagArea =
            document.getElementById(
                "newFreeTagArea"
            );

        const newFreeTag =
            document.getElementById(
                "newFreeTag"
            );


        const seriesSearch =
            document.getElementById(
                "seriesSearch"
            );

        const seriesChoices =
            document.getElementById(
                "seriesChoices"
            );

        const seriesSelected =
            document.getElementById(
                "seriesSelected"
            );

        const newSeriesToggle =
            document.getElementById(
                "newSeriesToggle"
            );

        const newSeriesArea =
            document.getElementById(
                "newSeriesArea"
            );

        const newSeries =
            document.getElementById(
                "newSeries"
            );


        /* ==================================
           作品管理検索
           ================================== */

        const workNumberSearch =
            document.getElementById(
                "workNumberSearch"
            );

        const workNumberSearchButton =
            document.getElementById(
                "workNumberSearchButton"
            );

        const adminSearchResult =
            document.getElementById(
                "adminSearchResult"
            );


        /* ==================================
           選択状態
           ================================== */

        let selectedFixedTags = [];

        let selectedFreeTags = [];

        let selectedSeries = [];


        /* ==================================
           PDF関連
           ================================== */

        let generatedThumbnailBlob =
            null;


        /* ==================================
           PDF.js読み込み状態
           ================================== */

        let pdfJsLoadingPromise =
            null;


        /* ==================================
           works確認
           Version 13.1
           ================================== */

        const workList =
            typeof works !== "undefined"
            &&
            Array.isArray(works)
                ? works
                : [];


        /* ==================================
           API URL
           ================================== */

        const API_URL =
            "https://project-library-api.saaachi-app.workers.dev";


        /* ==================================
           エスケープ
           ================================== */

        function escapeHtml(
            value
        ){

            return String(
                value ?? ""
            )
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


        /* ==================================
           配列化ヘルパー
           ================================== */

        function toArray(
            value
        ){

            if(
                Array.isArray(value)
            ){

                return value;

            }


            if(
                value === null ||
                value === undefined ||
                value === ""
            ){

                return [];

            }


            return [value];

        }


        /* ==================================
           カテゴリ取得
           ================================== */

        function getSelectedCategories(){

            return Array.from(
                categoryInputs
            )
            .filter(
                input =>
                    input.checked
            )
            .map(
                input =>
                    input.value
            );

        }


        /* ==================================
           選択タグ描画
           ================================== */

        function renderSelectedChoices(
            container,
            items,
            removeCallback
        ){

            if(!container){
                return;
            }


            container.innerHTML =
                "";


            items.forEach(
                function(item){

                    const span =
                        document.createElement(
                            "span"
                        );

                    span.className =
                        "selected-choice";


                    span.innerHTML =
                        `
                        <span>
                            ${escapeHtml(item)}
                        </span>

                        <button
                            type="button"
                            aria-label="削除"
                        >
                            ×
                        </button>
                        `;


                    span
                        .querySelector("button")
                        .addEventListener(
                            "click",
                            function(){

                                removeCallback(
                                    item
                                );

                            }
                        );


                    container.appendChild(
                        span
                    );

                }
            );

        }


        /* ==================================
           候補描画
           ================================== */

        function renderChoiceResults(
            container,
            items,
            selectedItems,
            addCallback
        ){

            if(!container){
                return;
            }


            container.innerHTML =
                "";


            if(
                !items ||
                items.length === 0
            ){

                container.innerHTML =
                    `
                    <p class="choice-empty">
                        候補がありません。
                    </p>
                    `;

                return;

            }


            items.forEach(
                function(item){

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type =
                        "button";

                    button.className =
                        "choice-button";


                    if(
                        selectedItems
                            .includes(item)
                    ){

                        button.classList.add(
                            "selected"
                        );

                    }


                    button.textContent =
                        item;


                    button.addEventListener(
                        "click",
                        function(){

                            addCallback(
                                item
                            );

                        }
                    );


                    container.appendChild(
                        button
                    );

                }
            );

        }


        /* ==================================
           固定タグ
           ================================== */

        function getAllFixedTags(){

            const set =
                new Set();


            workList.forEach(
                function(work){

                    toArray(
                        work.fixedTags
                    )
                    .forEach(
                        function(tag){

                            set.add(
                                tag
                            );

                        }
                    );

                }
            );


            return Array.from(
                set
            );

        }


        function renderFixedTags(){

            const keyword =
                String(
                    fixedTagSearch?.value ||
                    ""
                )
                .trim()
                .toLowerCase();


            const candidates =
                getAllFixedTags()
                .filter(
                    tag =>
                        !keyword ||
                        String(tag)
                            .toLowerCase()
                            .includes(
                                keyword
                            )
                );


            renderChoiceResults(
                fixedTagChoices,
                candidates,
                selectedFixedTags,
                function(tag){

                    if(
                        selectedFixedTags
                            .includes(tag)
                    ){

                        selectedFixedTags =
                            selectedFixedTags
                                .filter(
                                    item =>
                                        item !== tag
                                );

                    }else{

                        selectedFixedTags.push(
                            tag
                        );

                    }


                    renderFixedTags();

                    renderSelectedChoices(
                        fixedTagSelected,
                        selectedFixedTags,
                        function(item){

                            selectedFixedTags =
                                selectedFixedTags
                                    .filter(
                                        tag =>
                                            tag !== item
                                    );

                            renderFixedTags();

                            renderSelectedChoices(
                                fixedTagSelected,
                                selectedFixedTags,
                                function(removeItem){

                                    selectedFixedTags =
                                        selectedFixedTags
                                            .filter(
                                                tag =>
                                                    tag !== removeItem
                                            );

                                    renderFixedTags();

                                }
                            );

                        }
                    );

                }
            );


            renderSelectedChoices(
                fixedTagSelected,
                selectedFixedTags,
                function(item){

                    selectedFixedTags =
                        selectedFixedTags
                            .filter(
                                tag =>
                                    tag !== item
                            );

                    renderFixedTags();

                }
            );

        }


        /* ==================================
           自由タグ
           ================================== */

        function getAllFreeTags(){

            const set =
                new Set();


            workList.forEach(
                function(work){

                    toArray(
                        work.freeTags
                    )
                    .forEach(
                        function(tag){

                            set.add(
                                tag
                            );

                        }
                    );

                }
            );


            return Array.from(
                set
            );

        }


        function renderFreeTags(){

            const keyword =
                String(
                    freeTagSearch?.value ||
                    ""
                )
                .trim()
                .toLowerCase();


            const candidates =
                getAllFreeTags()
                .filter(
                    tag =>
                        !keyword ||
                        String(tag)
                            .toLowerCase()
                            .includes(
                                keyword
                            )
                );


            renderChoiceResults(
                freeTagChoices,
                candidates,
                selectedFreeTags,
                function(tag){

                    if(
                        selectedFreeTags
                            .includes(tag)
                    ){

                        selectedFreeTags =
                            selectedFreeTags
                                .filter(
                                    item =>
                                        item !== tag
                                );

                    }else{

                        selectedFreeTags.push(
                            tag
                        );

                    }


                    renderFreeTags();

                    renderSelectedChoices(
                        freeTagSelected,
                        selectedFreeTags,
                        function(item){

                            selectedFreeTags =
                                selectedFreeTags
                                    .filter(
                                        tag =>
                                            tag !== item
                                    );

                            renderFreeTags();

                        }
                    );

                }
            );


            renderSelectedChoices(
                freeTagSelected,
                selectedFreeTags,
                function(item){

                    selectedFreeTags =
                        selectedFreeTags
                            .filter(
                                tag =>
                                    tag !== item
                            );

                    renderFreeTags();

                }
            );

        }


        /* ==================================
           シリーズ
           ================================== */

        function getAllSeries(){

            const set =
                new Set();


            workList.forEach(
                function(work){

                    /*
                     * series が
                     * 配列でも文字列でも
                     * 正常に扱えるようにする。
                     */

                    toArray(
                        work.series
                    )
                    .forEach(
                        function(series){

                            if(
                                series !== null &&
                                series !== undefined &&
                                String(series).trim() !== ""
                            ){

                                set.add(
                                    series
                                );

                            }

                        }
                    );

                }
            );


            return Array.from(
                set
            );

        }


        function renderSeries(){

            const keyword =
                String(
                    seriesSearch?.value ||
                    ""
                )
                .trim()
                .toLowerCase();


            const candidates =
                getAllSeries()
                .filter(
                    series =>
                        !keyword ||
                        String(series)
                            .toLowerCase()
                            .includes(
                                keyword
                            )
                );


            renderChoiceResults(
                seriesChoices,
                candidates,
                selectedSeries,
                function(series){

                    if(
                        selectedSeries
                            .includes(series)
                    ){

                        selectedSeries =
                            selectedSeries
                                .filter(
                                    item =>
                                        item !== series
                                );

                    }else{

                        selectedSeries.push(
                            series
                        );

                    }


                    renderSeries();

                    renderSelectedChoices(
                        seriesSelected,
                        selectedSeries,
                        function(item){

                            selectedSeries =
                                selectedSeries
                                    .filter(
                                        value =>
                                            value !== item
                                    );

                            renderSeries();

                        }
                    );

                }
            );


            renderSelectedChoices(
                seriesSelected,
                selectedSeries,
                function(item){

                    selectedSeries =
                        selectedSeries
                            .filter(
                                value =>
                                    value !== item
                            );

                    renderSeries();

                }
            );

        }


        /* ==================================
           新規タグ・シリーズ
           ================================== */

        function setupToggle(
            button,
            area
        ){

            if(
                !button ||
                !area
            ){

                return;

            }


            button.addEventListener(
                "click",
                function(){

                    area.classList.toggle(
                        "open"
                    );

                }
            );

        }


        setupToggle(
            newFixedTagToggle,
            newFixedTagArea
        );


        setupToggle(
            newFreeTagToggle,
            newFreeTagArea
        );


        setupToggle(
            newSeriesToggle,
            newSeriesArea
        );


        fixedTagSearch?.addEventListener(
            "input",
            renderFixedTags
        );


        freeTagSearch?.addEventListener(
            "input",
            renderFreeTags
        );


        seriesSearch?.addEventListener(
            "input",
            renderSeries
        );


        /* ==================================
           PDF.jsを動的読み込み
           ================================== */

        function loadPdfJs(){

            if(
                typeof pdfjsLib !==
                "undefined"
            ){

                return Promise.resolve(
                    pdfjsLib
                );

            }


            if(
                pdfJsLoadingPromise
            ){

                return pdfJsLoadingPromise;

            }


            pdfJsLoadingPromise =
                new Promise(
                    function(resolve, reject){

                        const script =
                            document.createElement(
                                "script"
                            );


                        script.src =
                            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";


                        script.async =
                            true;


                        script.onload =
                            function(){

                                if(
                                    typeof pdfjsLib ===
                                    "undefined"
                                ){

                                    reject(
                                        new Error(
                                            "PDF.jsの読み込みに失敗しました。"
                                        )
                                    );

                                    return;

                                }


                                pdfjsLib
                                    .GlobalWorkerOptions
                                    .workerSrc =
                                    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


                                resolve(
                                    pdfjsLib
                                );

                            };


                        script.onerror =
                            function(){

                                reject(
                                    new Error(
                                        "PDF.jsを読み込めませんでした。"
                                    )
                                );

                            };


                        document.head.appendChild(
                            script
                        );

                    }
                );


            return pdfJsLoadingPromise;

        }


        /* ==================================
           全体透かし描画
           ================================== */

        function drawWatermark(
            context,
            width,
            height
        ){

            context.save();


            context.globalAlpha =
                0.13;


            context.fillStyle =
                "#555";


            context.font =
                "bold 13px Arial, sans-serif";


            context.textAlign =
                "center";


            context.textBaseline =
                "middle";


            const diagonal =
                Math.sqrt(
                    width * width +
                    height * height
                );


            context.translate(
                width / 2,
                height / 2
            );


            context.rotate(
                -25 *
                Math.PI /
                180
            );


            const spacingX =
                125;


            const spacingY =
                75;


            for(
                let y =
                    -diagonal;

                y <=
                    diagonal;

                y +=
                    spacingY
            ){

                for(
                    let x =
                        -diagonal;

                    x <=
                        diagonal;

                    x +=
                        spacingX
                ){

                    context.fillText(
                        "Project Library",
                        x,
                        y
                    );

                }

            }


            context.globalAlpha =
                0.10;


            context.font =
                "11px Arial, sans-serif";


            const secondSpacingX =
                170;


            const secondSpacingY =
                110;


            for(
                let y =
                    -diagonal;

                y <=
                    diagonal;

                y +=
                        secondSpacingY
            ){

                for(
                    let x =
                        -diagonal;

                    x <=
                        diagonal;

                    x +=
                        secondSpacingX
                ){

                    context.fillText(
                        "© あたまのストレッチ",
                        x + 40,
                        y + 35
                    );

                }

            }


            context.restore();

        }


        /* ==================================
           PDF → サムネイル
           Version 13.1
           ================================== */

        pdfFileInput?.addEventListener(
            "change",
            async function(){

                const file =
                    pdfFileInput.files?.[0];


                if(!file){

                    generatedThumbnailBlob =
                        null;

                    if(thumbnailPreview){

                        thumbnailPreview.innerHTML =
                            `
                            <span>
                                PDFを選択すると表示されます
                            </span>
                            `;

                    }

                    return;

                }


                if(
                    file.type !==
                    "application/pdf"
                    &&
                    !file.name
                        .toLowerCase()
                        .endsWith(
                            ".pdf"
                        )
                ){

                    alert(
                        "PDFファイルを選択してください。"
                    );

                    pdfFileInput.value =
                        "";

                    generatedThumbnailBlob =
                        null;

                    return;

                }


                try{

                    await loadPdfJs();

                }catch(error){

                    console.error(
                        error
                    );

                    alert(
                        "PDF読み込み機能の準備に失敗しました。\n\n" +
                        "ページを更新して、もう一度お試しください。"
                    );

                    return;

                }


                try{

                    if(thumbnailPreview){

                        thumbnailPreview.innerHTML =
                            `
                            <span>
                                サムネイルを作成中…⏳
                            </span>
                            `;

                    }


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
                        await pdf.getPage(
                            1
                        );


                    const viewport =
                        page.getViewport({
                            scale:1
                        });


                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    const context =
                        canvas.getContext(
                            "2d"
                        );


                    if(!context){

                        throw new Error(
                            "Canvasを利用できません。"
                        );

                    }


                    const thumbnailWidth =
                        500;


                    const scale =
                        thumbnailWidth /
                        viewport.width;


                    const scaledViewport =
                        page.getViewport({
                            scale
                        });


                    canvas.width =
                        Math.ceil(
                            scaledViewport.width
                        );


                    canvas.height =
                        Math.ceil(
                            scaledViewport.height
                        );


                    await page.render({

                        canvasContext:
                            context,

                        viewport:
                            scaledViewport

                    }).promise;


                    drawWatermark(
                        context,
                        canvas.width,
                        canvas.height
                    );


                    generatedThumbnailBlob =
                        await new Promise(
                            function(resolve){

                                canvas.toBlob(
                                    function(blob){

                                        resolve(
                                            blob
                                        );

                                    },
                                    "image/jpeg",
                                    0.88
                                );

                            }
                        );


                    if(
                        !generatedThumbnailBlob
                    ){

                        throw new Error(
                            "サムネイル画像の作成に失敗しました。"
                        );

                    }


                    if(thumbnailPreview){

                        const url =
                            URL.createObjectURL(
                                generatedThumbnailBlob
                            );


                        thumbnailPreview.innerHTML =
                            `
                            <img
                                src="${url}"
                                alt="サムネイルプレビュー"
                            >
                            `;

                    }


                }catch(error){

                    console.error(
                        error
                    );


                    generatedThumbnailBlob =
                        null;


                    if(thumbnailPreview){

                        thumbnailPreview.innerHTML =
                            `
                            <span>
                                サムネイルを作成できませんでした
                            </span>
                            `;

                    }


                    alert(
                        "サムネイルの作成に失敗しました。\n\n" +
                        error.message
                    );

                }

            }
        );


        /* ==================================
           前回データ
           ================================== */

        usePreviousDataButton?.addEventListener(
            "click",
            function(){

                const lastData =
                    localStorage.getItem(
                        "projectLibraryLastWork"
                    );


                if(!lastData){

                    alert(
                        "前回の登録データがありません。"
                    );

                    return;

                }


                try{

                    const data =
                        JSON.parse(
                            lastData
                        );


                    titleInput.value =
                        data.title || "";


                    descriptionInput.value =
                        data.description || "";


                    difficultyInput.value =
                        data.difficulty || "1";


                    sizeInput.value =
                        data.size || "A4";


                    categoryInputs.forEach(
                        function(input){

                            input.checked =
                                (
                                    data.category ||
                                    []
                                )
                                .includes(
                                    input.value
                                );

                        }
                    );


                    selectedFixedTags =
                        toArray(
                            data.fixedTags
                        );


                    selectedFreeTags =
                        toArray(
                            data.freeTags
                        );


                    selectedSeries =
                        toArray(
                            data.series
                        );


                    renderFixedTags();

                    renderFreeTags();

                    renderSeries();


                    alert(
                        "前回のデータを反映しました😊"
                    );

                }catch(error){

                    console.error(
                        error
                    );


                    alert(
                        "前回データの読み込みに失敗しました。"
                    );

                }

            }
        );


        /* ==================================
           検索結果クリア
           ================================== */

        function clearSearchResult(){

            if(!adminSearchResult){
                return;
            }


            adminSearchResult.innerHTML =
                `
                <p class="admin-search-empty">

                    作品番号の一部または
                    タイトルの一部を入力して検索してください。

                </p>
                `;

        }


        /* ==================================
           検索結果カード
           ================================== */

        function createSearchCard(
            work
        ){

            const workNo =
                String(
                    work.workNo ||
                    ""
                ).trim();


            const title =
                String(
                    work.title ||
                    "無題"
                );


            const category =
                Array.isArray(
                    work.category
                )
                    ? work.category.join(
                        " / "
                    )
                    : String(
                        work.category ||
                        ""
                    );


            const thumbnail =
                String(
                    work.thumbnail ||
                    ""
                );


            return `
                <article
                    class="admin-search-card"
                >

                    <div
                        class="admin-search-image"
                    >

                        ${
                            thumbnail
                                ? `
                                    <img
                                        src="${escapeHtml(thumbnail)}"
                                        alt="${escapeHtml(title)}"
                                    >
                                  `
                                : `
                                    <div
                                        style="
                                            padding:20px;
                                            text-align:center;
                                            color:#999;
                                            font-size:13px;
                                        "
                                    >
                                        サムネイルなし
                                    </div>
                                  `
                        }

                    </div>


                    <div
                        class="admin-search-info"
                    >

                        <p
                            class="admin-search-workno"
                        >

                            作品番号：

                            <strong>
                                ${
                                    escapeHtml(
                                        workNo ||
                                        "未登録"
                                    )
                                }
                            </strong>

                        </p>


                        <h3>
                            ${escapeHtml(title)}
                        </h3>


                        <p
                            class="admin-search-category"
                        >

                            ${
                                category
                                    ? escapeHtml(
                                        category
                                    )
                                    : "カテゴリ未設定"
                            }

                        </p>


                        <div
                            class="admin-search-actions"
                        >

                            <button
                                type="button"
                                class="admin-search-edit"
                                data-edit-id="${escapeHtml(
                                    work.id ||
                                    work.workId ||
                                    work.workNo ||
                                    ""
                                )}"
                            >
                                ✏️ 編集
                            </button>


                            <button
                                type="button"
                                class="admin-search-delete"
                                data-delete-id="${escapeHtml(
                                    work.id ||
                                    work.workId ||
                                    work.workNo ||
                                    ""
                                )}"
                            >
                                🗑️ 削除
                            </button>

                        </div>

                    </div>

                </article>
            `;

        }


        /* ==================================
           検索結果表示
           ================================== */

        function renderSearchResults(
            matchedWorks,
            keyword
        ){

            if(!adminSearchResult){
                return;
            }


            if(
                !matchedWorks ||
                matchedWorks.length === 0
            ){

                adminSearchResult.innerHTML =
                    `
                    <p class="admin-search-empty">

                        「${escapeHtml(keyword)}」
                        に一致する作品が見つかりませんでした🥲

                    </p>
                    `;

                return;

            }


            adminSearchResult.innerHTML =
                `
                <p
                    class="admin-search-count"
                >

                    検索結果：
                    ${matchedWorks.length}件
                    ${
                        matchedWorks.length >= 3
                            ? "（最大3件）"
                            : ""
                    }

                </p>

                ${
                    matchedWorks
                        .map(
                            createSearchCard
                        )
                        .join("")
                }
                `;


            adminSearchResult
                .querySelectorAll(
                    "[data-edit-id]"
                )
                .forEach(
                    function(button){

                        button.addEventListener(
                            "click",
                            function(){

                                const id =
                                    button
                                        .dataset
                                        .editId;


                                editWork(
                                    id
                                );

                            }
                        );

                    }
                );


            adminSearchResult
                .querySelectorAll(
                    "[data-delete-id]"
                )
                .forEach(
                    function(button){

                        button.addEventListener(
                            "click",
                            function(){

                                const id =
                                    button
                                        .dataset
                                        .deleteId;


                                deleteWork(
                                    id
                                );

                            }
                        );

                    }
                );

        }


        /* ==================================
           作品検索 Version 13.1
           ================================== */

        function searchWorkByNumber(){

            if(!adminSearchResult){
                return;
            }


            const keyword =
                String(
                    workNumberSearch?.value ||
                    ""
                )
                .trim()
                .toLowerCase();


            if(!keyword){

                clearSearchResult();

                return;

            }


            const matchedWorks =
                workList
                    .filter(
                        function(work){

                            const workNo =
                                String(
                                    work.workNo ||
                                    ""
                                )
                                .toLowerCase();


                            const title =
                                String(
                                    work.title ||
                                    ""
                                )
                                .toLowerCase();


                            return (
                                workNo.includes(
                                    keyword
                                )
                                ||
                                title.includes(
                                    keyword
                                )
                            );

                        }
                    )
                    .slice(
                        0,
                        3
                    );


            renderSearchResults(
                matchedWorks,
                keyword
            );

        }


        workNumberSearchButton?.addEventListener(
            "click",
            searchWorkByNumber
        );


        workNumberSearch?.addEventListener(
            "keydown",
            function(event){

                if(
                    event.key ===
                    "Enter"
                ){

                    event.preventDefault();

                    searchWorkByNumber();

                }

            }
        );


        /* ==================================
           編集
           ================================== */

        function editWork(
            id
        ){

            const work =
                workList.find(
                    function(item){

                        return (
                            String(
                                item.id ||
                                item.workId ||
                                item.workNo ||
                                ""
                            )
                            ===
                            String(id)
                        );

                    }
                );


            if(!work){

                alert(
                    "作品データが見つかりません。"
                );

                return;

            }


            titleInput.value =
                work.title || "";


            descriptionInput.value =
                work.description || "";


            difficultyInput.value =
                work.level || "1";


            sizeInput.value =
                work.size || "A4";


            categoryInputs.forEach(
                function(input){

                    input.checked =
                        (
                            Array.isArray(
                                work.category
                            )
                                ? work.category
                                : [work.category]
                        )
                        .includes(
                            input.value
                        );

                }
            );


            selectedFixedTags =
                toArray(
                    work.fixedTags
                );


            selectedFreeTags =
                toArray(
                    work.freeTags
                );


            /*
             * series が文字列でも配列でも
             * 正常に編集できるようにする。
             */

            selectedSeries =
                toArray(
                    work.series
                );


            editIdInput.value =
                work.id ||
                work.workId ||
                work.workNo ||
                "";


            renderFixedTags();

            renderFreeTags();

            renderSeries();


            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

        }


        /* ==================================
           削除
           Version 13.1
           ================================== */

        async function deleteWork(
            id
        ){

            const work =
                workList.find(
                    function(item){

                        return (
                            String(
                                item.id ||
                                item.workId ||
                                item.workNo ||
                                ""
                            )
                            ===
                            String(id)
                        );

                    }
                );


            if(!work){

                alert(
                    "作品データが見つかりません。"
                );

                return;

            }


            const workId =
                String(
                    work.id ||
                    work.workId ||
                    ""
                );


            const workNo =
                String(
                    work.workNo ||
                    "作品番号不明"
                );


            const title =
                String(
                    work.title ||
                    "無題"
                );


            const confirmed =
                confirm(
                    `⚠️ 作品を削除します\n\n` +
                    `「${title}」\n` +
                    `作品番号：${workNo}\n\n` +
                    `PDF・サムネイル・作品情報が` +
                    `GitHubから削除されます。\n\n` +
                    `本当に削除しますか？`
                );


            if(!confirmed){

                return;

            }


            const deleteButtons =
                adminSearchResult
                    ?.querySelectorAll(
                        ".admin-search-delete"
                    );


            if(deleteButtons){

                deleteButtons.forEach(
                    function(button){

                        button.disabled =
                            true;

                        button.textContent =
                            "⏳ 削除中...";

                    }
                );

            }


            try{

                const formData =
                    new FormData();


                formData.append(
                    "action",
                    "delete"
                );


                formData.append(
                    "workId",
                    workId
                );


                formData.append(
                    "workNo",
                    workNo
                );


                formData.append(
                    "title",
                    title
                );


                const response =
                    await fetch(
                        API_URL,
                        {
                            method:
                                "POST",

                            body:
                                formData
                        }
                    );


                const result =
                    await response.json();


                if(
                    !response.ok ||
                    !result.success
                ){

                    throw new Error(
                        result?.error ||
                        "削除リクエストの送信に失敗しました。"
                    );

                }


                if(deleteButtons){

                    deleteButtons.forEach(
                        function(button){

                            button.disabled =
                                false;

                            button.textContent =
                                "🗑️ 削除";

                        }
                    );

                }


                alert(
                    "🗑️ 削除リクエストを送信しました！\n\n" +
                    `「${title}」\n` +
                    `作品番号：${workNo}\n\n` +
                    "GitHub Actionsで削除処理が実行されます😊\n\n" +
                    "処理完了後、ページを更新すると作品が消えます。"
                );


            }catch(error){

                console.error(
                    error
                );


                alert(
                    "削除に失敗しました。\n\n" +
                    error.message
                );


                if(deleteButtons){

                    deleteButtons.forEach(
                        function(button){

                            button.disabled =
                                false;

                            button.textContent =
                                "🗑️ 削除";

                        }
                    );

                }

            }

        }


        /* ==================================
           公開
           ================================== */

        const publishButton =
            document.querySelector(
                ".publish"
            );


        publishButton?.addEventListener(
            "click",
            async function(){

                if(!form){
                    return;
                }


                const title =
                    titleInput.value.trim();


                if(!title){

                    alert(
                        "タイトルを入力してください。"
                    );

                    return;

                }


                const categories =
                    getSelectedCategories();


                if(
                    categories.length === 0
                ){

                    alert(
                        "カテゴリを1つ以上選択してください。"
                    );

                    return;

                }


                const pdfFile =
                    pdfFileInput
                        ?.files?.[0];


                const editId =
                    editIdInput.value.trim();


                if(
                    !pdfFile &&
                    !editId
                ){

                    alert(
                        "PDFファイルを選択してください。"
                    );

                    return;

                }


                try{

                    const formData =
                        new FormData();


                    formData.append(
                        "title",
                        title
                    );


                    formData.append(
                        "description",
                        descriptionInput.value.trim()
                    );


                    formData.append(
                        "category",
                        JSON.stringify(
                            categories
                        )
                    );


                    formData.append(
                        "fixedTags",
                        JSON.stringify(
                            selectedFixedTags
                        )
                    );


                    formData.append(
                        "freeTags",
                        JSON.stringify(
                            selectedFreeTags
                        )
                    );


                    formData.append(
                        "series",
                        JSON.stringify(
                            selectedSeries
                        )
                    );


                    formData.append(
                        "level",
                        difficultyInput.value
                    );


                    formData.append(
                        "size",
                        sizeInput.value
                    );


                    formData.append(
                        "workId",
                        editId
                    );


                    if(pdfFile){

                        formData.append(
                            "pdf",
                            pdfFile
                        );

                    }


                    if(generatedThumbnailBlob){

                        const thumbnailFile =
                            new File(
                                [
                                    generatedThumbnailBlob
                                ],
                                "thumbnail.jpg",
                                {
                                    type:
                                        "image/jpeg"
                                }
                            );


                        formData.append(
                            "thumbnail",
                            thumbnailFile
                        );

                    }


                    const response =
                        await fetch(
                            API_URL,
                            {
                                method:
                                    "POST",

                                body:
                                    formData
                            }
                        );


                    const result =
                        await response.json();


                    if(
                        !response.ok
                    ){

                        throw new Error(
                            result?.error ||
                            "公開に失敗しました。"
                        );

                    }


                    localStorage.setItem(
                        "projectLibraryLastWork",
                        JSON.stringify({

                            title,

                            description:
                                descriptionInput
                                    .value
                                    .trim(),

                            category:
                                categories,

                            fixedTags:
                                selectedFixedTags,

                            freeTags:
                                selectedFreeTags,

                            series:
                                selectedSeries,

                            difficulty:
                                difficultyInput
                                    .value,

                            size:
                                sizeInput
                                    .value

                        })
                    );


                    alert(
                        "🚀 公開リクエストを送信しました！\n\nGitHub Actionsが実行されます😊"
                    );


                    form.reset();


                    selectedFixedTags =
                        [];

                    selectedFreeTags =
                        [];

                    selectedSeries =
                        [];


                    editIdInput.value =
                        "";


                    generatedThumbnailBlob =
                        null;


                    renderFixedTags();

                    renderFreeTags();

                    renderSeries();


                    if(thumbnailPreview){

                        thumbnailPreview.innerHTML =
                            `
                            <span>
                                PDFを選択すると表示されます
                            </span>
                            `;

                    }


                }catch(error){

                    console.error(
                        error
                    );


                    alert(
                        "公開に失敗しました。\n\n" +
                        error.message
                    );

                }

            }
        );


        /* ==================================
           下書き保存
           ================================== */

        const draftButton =
            document.querySelector(
                ".draft"
            );


        draftButton?.addEventListener(
            "click",
            function(){

                const draft = {

                    title:
                        titleInput.value.trim(),

                    description:
                        descriptionInput.value.trim(),

                    category:
                        getSelectedCategories(),

                    fixedTags:
                        selectedFixedTags,

                    freeTags:
                        selectedFreeTags,

                    series:
                        selectedSeries,

                    difficulty:
                        difficultyInput.value,

                    size:
                        sizeInput.value

                };


                localStorage.setItem(
                    "projectLibraryDraft",
                    JSON.stringify(
                        draft
                    )
                );


                alert(
                    "下書きを保存しました😊"
                );

            }
        );


        /* ==================================
           初期表示
           ================================== */

        renderFixedTags();

        renderFreeTags();

        renderSeries();

        clearSearchResult();


        /* ==================================
           Version表示
           ================================== */

        console.log(
            "Project Library admin.js Version13.1"
        );

    }
);