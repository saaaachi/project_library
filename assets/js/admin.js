// ==========================
// Project Library
// admin.js
// Version 8.0
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
const workList =
    document.getElementById("workList");
const editIdInput =
    document.getElementById("editId");
// --------------------------
// 状態
// --------------------------
let editId = null;
let selectedPdfFile = null;
let workData = createEmptyWorkData();
// --------------------------
// 空データ
// --------------------------
function createEmptyWorkData() {
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
function toArray(value) {
    if (Array.isArray(value)) {
        return value
            .map(v => String(v).trim())
            .filter(Boolean);
    }
    if (!value) {
        return [];
    }
    return String(value)
        .split(",")
        .map(v => v.trim())
        .filter(Boolean);
}
function uniqueArray(array) {
    return [...new Set(
        array
            .map(v => String(v).trim())
            .filter(Boolean)
    )];
}
function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// --------------------------
// 既存データ取得
// --------------------------
function getAllFixedTags() {
    const tags = [];
    works.forEach(work => {
        if (Array.isArray(work.fixedTags)) {
            tags.push(...work.fixedTags);
        }
    });
    return uniqueArray(tags).sort(
        (a, b) => a.localeCompare(b, "ja")
    );
}
function getAllFreeTags() {
    const tags = [];
    works.forEach(work => {
        if (Array.isArray(work.freeTags)) {
            tags.push(...work.freeTags);
        }
    });
    return uniqueArray(tags).sort(
        (a, b) => a.localeCompare(b, "ja")
    );
}
function getAllSeries() {
    const series = [];
    works.forEach(work => {
        if (work.series) {
            series.push(work.series);
        }
    });
    return uniqueArray(series).sort(
        (a, b) => a.localeCompare(b, "ja")
    );
}
// --------------------------
// タグ選択UI
// --------------------------
function renderChoiceButtons(
    container,
    values,
    selectedValues,
    multiple = true
) {
    if (!container) {
        return;
    }
    container.innerHTML = "";
    if (!values.length) {
        container.innerHTML =
            `<p class="choice-empty">
                まだ登録されていません
            </p>`;
        return;
    }
    values.forEach(value => {
        const button =
            document.createElement("button");
        button.type = "button";
        button.className =
            "tag-choice";
        button.textContent =
            value;
        button.dataset.value =
            value;
        if (selectedValues.includes(value)) {
            button.classList.add("selected");
        }
        button.addEventListener(
            "click",
            () => {
                if (multiple) {
                    button.classList.toggle(
                        "selected"
                    );
                } else {
                    container
                        .querySelectorAll(
                            ".tag-choice"
                        )
                        .forEach(other => {
                            other.classList.remove(
                                "selected"
                            );
                        });
                    button.classList.add(
                        "selected"
                    );
                }
            }
        );
        container.appendChild(button);
    });
}
// --------------------------
// 選択済みタグ取得
// --------------------------
function getSelectedChoiceValues(container) {
    if (!container) {
        return [];
    }
    return [...container.querySelectorAll(
        ".tag-choice.selected"
    )]
        .map(button => button.dataset.value)
        .filter(Boolean);
}
// --------------------------
// 新規タグ入力取得
// --------------------------
function getInputValue(id) {
    const element =
        document.getElementById(id);
    return element
        ? element.value.trim()
        : "";
}
// --------------------------
// タグ・シリーズUI初期化
// --------------------------
function renderTagAndSeriesChoices() {
    renderChoiceButtons(
        fixedTagChoices,
        getAllFixedTags(),
        workData.fixedTags,
        true
    );
    renderChoiceButtons(
        freeTagChoices,
        getAllFreeTags(),
        workData.freeTags,
        true
    );
    renderChoiceButtons(
        seriesChoices,
        getAllSeries(),
        workData.series
            ? [workData.series]
            : [],
        false
    );
}
// --------------------------
// サムネイル表示
// --------------------------
function showThumbnail(src) {
    if (!thumbnailPreview) {
        return;
    }
    if (!src) {
        thumbnailPreview.style.display =
            "none";
        thumbnailPreview.src = "";
        return;
    }
    thumbnailPreview.src = src;
    thumbnailPreview.style.display =
        "block";
    thumbnailPreview.style.width =
        "220px";
    thumbnailPreview.style.maxWidth =
        "100%";
    thumbnailPreview.style.height =
        "auto";
}
function resetThumbnail() {
    if (!thumbnailPreview) {
        return;
    }
    thumbnailPreview.src = "";
    thumbnailPreview.style.display =
        "none";
}
// --------------------------
// PDF.js
// --------------------------
let pdfjsLibPromise = null;
function loadPdfJs() {
    if (!pdfjsLibPromise) {
        pdfjsLibPromise =
            import(
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
            ).then(pdfjsLib => {
                pdfjsLib.GlobalWorkerOptions.workerSrc =
                    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
                return pdfjsLib;
            });
    }
    return pdfjsLibPromise;
}
// --------------------------
// PDF → サムネイル生成
// --------------------------
async function createPdfThumbnailWithWatermark(file) {
    const pdfjsLib =
        await loadPdfJs();
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
    await page.render({
        canvasContext: context,
        viewport: viewport
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
    for (
        let y = -canvas.height;
        y < canvas.height * 2;
        y += 150
    ) {
        for (
            let x = -canvas.width;
            x < canvas.width * 2;
            x += 260
        ) {
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
if (pdfInput) {
    pdfInput.addEventListener(
        "change",
        async () => {
            const file =
                pdfInput.files?.[0];
            if (!file) {
                return;
            }
            selectedPdfFile =
                file;
            // 新しくPDFを選択した場合
            // workData.pdf は実ファイル送信用に保持
            workData.pdf =
                file;
            showThumbnail("");
            if (thumbnailPreview) {
                thumbnailPreview.alt =
                    "サムネイル作成中…";
            }
            try {
                const thumbnail =
                    await createPdfThumbnailWithWatermark(
                        file
                    );
                workData.thumbnail =
                    thumbnail;
                showThumbnail(
                    thumbnail
                );
            } catch (error) {
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
function getSelectedCategories() {
    if (!form) {
        return [];
    }
    return [
        ...form.querySelectorAll(
            'input[type="checkbox"][data-category]:checked'
        )
    ]
        .map(input => input.value)
        .filter(Boolean);
}
// --------------------------
// フォームからデータ取得
// --------------------------
function collectFormData() {
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
                "level"
            )?.value || 1
        );
    // --------------------------
    // 既存タグ
    // --------------------------
    const selectedFixedTags =
        getSelectedChoiceValues(
            fixedTagChoices
        );
    const selectedFreeTags =
        getSelectedChoiceValues(
            freeTagChoices
        );
    // --------------------------
    // 新しいタグ
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
    const fixedTags =
        uniqueArray([
            ...selectedFixedTags,
            ...newFixedTags
        ]);
    const freeTags =
        uniqueArray([
            ...selectedFreeTags,
            ...newFreeTags
        ]);
    // --------------------------
    // シリーズ
    // --------------------------
    const selectedSeries =
        getSelectedChoiceValues(
            seriesChoices
        )[0] || "";
    const newSeries =
        getInputValue(
            "newSeries"
        );
    const series =
        newSeries ||
        selectedSeries;
    // --------------------------
    // サムネイル
    // --------------------------
    const thumbnail =
        workData.thumbnail || "";
    return {
        title,
        description,
        category:
            getSelectedCategories(),
        fixedTags,
        freeTags,
        series,
        level,
        thumbnail,
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
function validateForm(data) {
    if (!data.title) {
        alert(
            "作品タイトルを入力してください🥹"
        );
        return false;
    }
    if (!data.category.length) {
        alert(
            "カテゴリを1つ以上選択してください🥹"
        );
        return false;
    }
    // 新規投稿時のみPDF必須
    if (!editId && !selectedPdfFile) {
        alert(
            "PDFファイルを選択してください🥹"
        );
        return false;
    }
    // 新規投稿時
    if (!editId && !data.thumbnail) {
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
function getNextWorkId() {
    if (!works.length) {
        return 1;
    }
    return Math.max(
        ...works.map(
            work => Number(work.id) || 0
        )
    ) + 1;
}
// --------------------------
// 次の作品番号
// --------------------------
function getNextWorkNo() {
    if (!works.length) {
        return "PL-000001";
    }
    const maxNo =
        Math.max(
            ...works.map(work => {
                const match =
                    String(
                        work.workNo || ""
                    ).match(
                        /(\d+)$/
                    );
                return match
                    ? Number(match[1])
                    : 0;
            })
        );
    return `PL-${String(
        maxNo + 1
    ).padStart(6, "0")}`;
}
// --------------------------
// 作品データ生成
// --------------------------
function generateWorkData() {
    const data =
        collectFormData();
    if (!validateForm(data)) {
        return null;
    }
    const now =
        new Date()
            .toISOString()
            .slice(0, 10);
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
function saveWork() {
    const data =
        generateWorkData();
    if (!data) {
        return null;
    }
    workData =
        data;
    return data;
}
// --------------------------
// 公開データ送信
// --------------------------
async function triggerGitHubPublish() {
    const data =
        saveWork();
    if (!data) {
        return;
    }
    // --------------------------
    // 新規投稿
    // --------------------------
    if (!editId && !selectedPdfFile) {
        alert(
            "PDFファイルを選択してください🥹"
        );
        return;
    }
    // --------------------------
    // 現在のWorker仕様では
    // 新規投稿時にPDFが必要
    // --------------------------
    if (!selectedPdfFile) {
        alert(
            "現在の公開処理ではPDFファイルが必要です。\n編集する場合も、いったんPDFを再選択してください🙏"
        );
        return;
    }
    try {
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
            String(data.level)
        );
        formData.append(
            "workNo",
            data.workNo
        );
        formData.append(
            "workId",
            String(data.id)
        );
        formData.append(
            "pdf",
            selectedPdfFile
        );
        // 自動生成サムネイル
        const thumbnailBlob =
            await dataUrlToBlob(
                data.thumbnail
            );
        formData.append(
            "thumbnail",
            thumbnailBlob,
            `${data.title}.jpg`
        );
        const response =
            await fetch(
                API_WORKER_URL,
                {
                    method: "POST",
                    body: formData
                }
            );
        const result =
            await response.json()
                .catch(() => ({}));
        if (!response.ok) {
            throw new Error(
                result.error ||
                `HTTP ${response.status}`
            );
        }
        alert(
            "作品を追加しました😊✨\n\nGitHub Actionsで公開処理が始まります🚀"
        );
        resetForm();
    } catch (error) {
        console.error(
            "公開エラー:",
            error
        );
        alert(
            `公開に失敗しました🥲\n\n${error.message}`
        );
    } finally {
        publishButton.disabled =
            false;
        publishButton.textContent =
            "🚀 公開する";
    }
}
// --------------------------
// Data URL → Blob
// --------------------------
function dataUrlToBlob(dataUrl) {
    if (!dataUrl) {
        return null;
    }
    const parts =
        dataUrl.split(",");
    const mimeMatch =
        parts[0].match(
            /:(.*?);/
        );
    const mime =
        mimeMatch
            ? mimeMatch[1]
            : "image/jpeg";
    const binary =
        atob(parts[1]);
    const length =
        binary.length;
    const bytes =
        new Uint8Array(length);
    for (
        let i = 0;
        i < length;
        i++
    ) {
        bytes[i] =
            binary.charCodeAt(i);
    }
    return new Blob(
        [bytes],
        { type: mime }
    );
}
// --------------------------
// 作品一覧
// --------------------------
function renderList() {
    if (!workList) {
        return;
    }
    workList.innerHTML =
        "";
    if (!works.length) {
        workList.innerHTML =
            `<p>まだ作品がありません。</p>`;
        return;
    }
    works.forEach(work => {
        const row =
            document.createElement("div");
        row.className =
            "work-row";
        const categories =
            Array.isArray(work.category)
                ? work.category.join(" / ")
                : work.category || "";
        row.innerHTML = `
            <div class="work-row-no">
                ${escapeHtml(
                    work.workNo || ""
                )}
            </div>
            <div class="work-row-title">
                ${escapeHtml(
                    work.title || ""
                )}
            </div>
            <div class="work-row-category">
                ${escapeHtml(
                    categories
                )}
            </div>
            <div class="work-row-level">
                ${"★".repeat(
                    Number(work.level) || 1
                )}
            </div>
            <div class="work-row-actions">
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
            </div>
        `;
        workList.appendChild(
            row
        );
    });
    workList
        .querySelectorAll(
            ".edit-work-button"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    editWork(
                        button.dataset.id
                    );
                }
            );
        });
    workList
        .querySelectorAll(
            ".delete-work-button"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    deleteWork(
                        button.dataset.id
                    );
                }
            );
        });
}
// --------------------------
// 編集
// --------------------------
function editWork(id) {
    const work =
        works.find(
            item =>
                String(item.id) ===
                String(id)
        );
    if (!work) {
        alert(
            "作品が見つかりません🥲"
        );
        return;
    }
    editId =
        work.id;
    if (editIdInput) {
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
        "level"
    ).value =
        work.level || 1;
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
        .forEach(input => {
            input.checked =
                workData.category.includes(
                    input.value
                );
        });
    // --------------------------
    // タグ・シリーズ
    // --------------------------
    renderTagAndSeriesChoices();
    // --------------------------
    // 既存サムネイル
    // --------------------------
    if (work.thumbnail) {
        showThumbnail(
            work.thumbnail
        );
    } else {
        resetThumbnail();
    }
    // --------------------------
    // PDF input
    // --------------------------
    if (pdfInput) {
        pdfInput.value =
            "";
    }
    // --------------------------
    // ボタン表示
    // --------------------------
    if (publishButton) {
        publishButton.textContent =
            "🚀 更新する";
    }
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
// --------------------------
// 削除
// --------------------------
function deleteWork(id) {
    const work =
        works.find(
            item =>
                String(item.id) ===
                String(id)
        );
    if (!work) {
        alert(
            "作品が見つかりません🥲"
        );
        return;
    }
    const confirmed =
        confirm(
            `「${work.title}」を削除しますか？\n\n※現在は管理画面上の確認のみです。GitHub上の作品ファイルはまだ削除されません。`
        );
    if (!confirmed) {
        return;
    }
    alert(
        "削除機能は次の段階でGitHubまで連動させます🙏"
    );
}
// --------------------------
// フォームリセット
// --------------------------
function resetForm() {
    if (form) {
        form.reset();
    }
    editId =
        null;
    selectedPdfFile =
        null;
    workData =
        createEmptyWorkData();
    if (editIdInput) {
        editIdInput.value =
            "";
    }
    resetThumbnail();
    renderTagAndSeriesChoices();
    if (publishButton) {
        publishButton.textContent =
            "🚀 公開する";
    }
}
// --------------------------
// 下書き
// --------------------------
if (draftButton) {
    draftButton.addEventListener(
        "click",
        () => {
            const data =
                generateWorkData();
            if (!data) {
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
// --------------------------
// 公開
// --------------------------
if (publishButton) {
    publishButton.addEventListener(
        "click",
        event => {
            event.preventDefault();
            triggerGitHubPublish();
        }
    );
}
// --------------------------
// 初期表示
// --------------------------
renderTagAndSeriesChoices();
renderList();
// --------------------------
// 起動ログ
// --------------------------
console.log(
    "Project Library admin.js Version 8.0"
);