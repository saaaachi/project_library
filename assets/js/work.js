
// ==========================
// Project Library
// work.js
// Version 5.7
// ==========================

// 通常ページ: work.html?id=1
// SEOページ: works/1.html
// SEOページの本文はHTML側で生成し、JSは操作機能を付加する。

const params = new URLSearchParams(location.search);
const seoPageMatch = location.pathname.match(/\/works\/(\d+)\.html$/);
const isSeoWorkPage = Boolean(seoPageMatch);
const id = isSeoWorkPage
    ? Number(seoPageMatch[1])
    : Number(params.get("id"));
const area = document.getElementById("workArea");
const work = works.find(item => item.id === id);
const siteRoot = isSeoWorkPage ? "../" : "";

function safeString(value){
    return value === undefined || value === null ? "" : String(value);
}

function escapeHtml(value){
    return safeString(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function toArray(value){
    if(Array.isArray(value)){
        return value.filter(item =>
            item !== undefined &&
            item !== null &&
            String(item).trim() !== ""
        );
    }
    if(value === undefined || value === null || value === ""){
        return [];
    }
    return [value];
}

function assetUrl(value){
    const path = safeString(value);
    if(!path){ return ""; }
    // 作品データはサイトルート相対の assets/... を使用する。
    if(/^assets\//.test(path)){
        return siteRoot + path.split("/").map(encodeURIComponent).join("/");
    }
    return path;
}

function pageUrl(file){
    return siteRoot + file;
}

function workUrl(item){
    // 本番公開前は従来のURLを維持する。
    return pageUrl("work.html?id=" + encodeURIComponent(item.id));
}

function createStars(level){
    switch(Number(level)){
        case 1: return "★☆☆";
        case 2: return "★★☆";
        case 3: return "★★★";
        default: return "";
    }
}

function createNewBadge(item){
    return item.isNew ? '<span class="badge badge-new">NEW</span>' : "";
}

function createRecommendBadge(item){
    return item.recommend ? '<span class="badge badge-recommend">おすすめ</span>' : "";
}

function logTagClick(tag){
    if(!tag){ return; }
    fetch("https://project-library-api.saaachi-app.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "tag_click", tag: tag })
    })
    .then(response => {
        if(!response.ok){
            throw new Error("タグクリックログ送信に失敗しました。");
        }
        return response.json();
    })
    .then(data => console.log("タグクリックを記録しました。", data))
    .catch(error => console.log("タグクリックログの記録に失敗しました。", error));
}

function createWorkAd100(){
    return `
<div class="work-ad-100">
<ins
class="adsbygoogle"
style="display:inline-block;width:728px;height:100px"
data-ad-client="ca-pub-1299640300068792"
data-ad-slot="5209302442">
</ins>
</div>`;
}

function activateWorkAds(){
    document.querySelectorAll(".work-ad-100 .adsbygoogle").forEach(ad => {
        if(ad.dataset.plAdActivated === "1"){ return; }
        ad.dataset.plAdActivated = "1";
        try{
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }catch(error){
            console.error("AdSense error:", error);
        }
    });
}

function createBreadcrumb(item){
    let html = `
<div class="breadcrumb">
<a href="${pageUrl("index.html")}">ホーム</a>
＞
<a href="${pageUrl("library.html")}">作品一覧</a>`;
    toArray(item.category).forEach(category => {
        html += `
＞
<a href="${pageUrl("library.html")}?category=${encodeURIComponent(category)}">${escapeHtml(category)}</a>`;
    });
    html += `
＞
<span class="current">${escapeHtml(item.title)}</span>
</div>`;
    return html;
}

function createDownloadFileName(title){
    const safeTitle = safeString(title)
        .replace(/[\\/:*?"<>|]/g, "")
        .trim()
        .replace(/\s+/g, "_");
    return (safeTitle || "Project_Library") + ".pdf";
}

function isMobileDevice(){
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function createTagLinks(tags){
    return toArray(tags).map(tag => `
<a
class="tag"
href="${pageUrl("library.html")}?tag=${encodeURIComponent(tag)}"
data-project-library-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</a>`).join("");
}

function createWorkMarkup(item){
    const categories = toArray(item.category);
    const fixedTags = toArray(item.fixedTags);
    const freeTags = toArray(item.freeTags);
    const tools = toArray(item.tools);
    return `
<section class="container">
${createBreadcrumb(item)}
${createNewBadge(item)}
${createRecommendBadge(item)}
<h1 class="section-title">${escapeHtml(item.title)}</h1>
<p class="level">${createStars(item.level)}</p>
<!-- タイトル下広告 -->
${createWorkAd100()}
<div class="card-tags">
${categories.map(category => `
<a class="tag" href="${pageUrl("library.html")}?category=${encodeURIComponent(category)}">${escapeHtml(category)}</a>`).join("")}
</div>
<div class="work-image">
<img src="${escapeHtml(assetUrl(item.thumbnail))}" alt="${escapeHtml(item.title)}">
</div>
<div class="info-box">
<div class="info-item"><b>対象年齢</b><br>${escapeHtml(item.age)}</div>
<div class="info-item"><b>印刷サイズ</b><br>${escapeHtml(item.size)}</div>
<div class="info-item"><b>必要な道具</b><br>${tools.map(escapeHtml).join("・")}</div>
</div>
<div class="work-description">${escapeHtml(item.description)}</div>
<h3>タグ</h3>
<div class="card-tags">
${createTagLinks(fixedTags)}
${createTagLinks(freeTags)}
${fixedTags.length === 0 && freeTags.length === 0 ? '<p style="color:#888;font-size:14px;margin:8px 0 0;">タグはありません。</p>' : ""}
</div>
<button type="button" class="button download-button" id="pdfDownloadButton" aria-label="${escapeHtml(item.title)}のPDFをダウンロード">📄 PDFをダウンロード</button>
<p id="pdfDownloadHelp" style="font-size:13px;color:#777;margin-top:8px;">iPhoneでは「ファイルに保存」を選択できます。</p>
<!-- ダウンロード下広告 -->
${createWorkAd100()}
<div class="section"><h3>ご利用について</h3><p>個人・教育・施設利用は無料です。<br>再配布・販売・データの転載は禁止しています。</p></div>
<div id="seriesArea"></div>
<div id="relatedArea"></div>
<div id="moveArea"></div>
</section>`;
}

function setupTagClickEvents(){
    document.querySelectorAll("[data-project-library-tag]").forEach(link => {
        if(link.dataset.plTagBound === "1"){ return; }
        link.dataset.plTagBound = "1";
        link.addEventListener("click", function(){
            logTagClick(this.getAttribute("data-project-library-tag"));
        });
    });
}

function setupPdfDownload(item){
    const pdfDownloadButton = document.getElementById("pdfDownloadButton");
    const pdfDownloadHelp = document.getElementById("pdfDownloadHelp");
    if(!pdfDownloadButton || pdfDownloadButton.dataset.plDownloadBound === "1"){
        return;
    }
    pdfDownloadButton.dataset.plDownloadBound = "1";
    pdfDownloadButton.addEventListener("click", async function(){
        if(!item.pdf){
            alert("PDFファイルが見つかりません。");
            return;
        }
        const pdfUrl = assetUrl(item.pdf);
        const originalText = pdfDownloadButton.textContent;
        pdfDownloadButton.disabled = true;
        pdfDownloadButton.textContent = "📄 PDFを準備中…";
        try{
            const response = await fetch(pdfUrl);
            if(!response.ok){
                throw new Error("PDFを取得できませんでした。");
            }
            const blob = await response.blob();
            const fileName = createDownloadFileName(item.title);
            const pdfFile = new File([blob], fileName, { type: "application/pdf" });
            if(
                isMobileDevice() &&
                navigator.share &&
                navigator.canShare &&
                navigator.canShare({ files: [pdfFile] })
            ){
                await navigator.share({
                    files: [pdfFile],
                    title: fileName,
                    text: safeString(item.title)
                });
                if(pdfDownloadHelp){
                    pdfDownloadHelp.textContent = "PDFの共有・保存画面を開きました😊";
                }
            }else{
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
                if(pdfDownloadHelp){
                    pdfDownloadHelp.textContent = "PDFのダウンロードを開始しました😊";
                }
            }
        }catch(error){
            console.error(error);
            if(error.name === "AbortError"){
                if(pdfDownloadHelp){
                    pdfDownloadHelp.textContent = "PDFの保存をキャンセルしました。";
                }
            }else{
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.target = "_blank";
                link.rel = "noopener";
                document.body.appendChild(link);
                link.click();
                link.remove();
                if(pdfDownloadHelp){
                    pdfDownloadHelp.textContent = "PDFを開きました。画面の共有ボタンから保存できます。";
                }
            }
        }finally{
            pdfDownloadButton.disabled = false;
            pdfDownloadButton.textContent = originalText;
        }
    });
}

function createWorkCard(item){
    return `
<a class="card" href="${workUrl(item)}">
<img src="${escapeHtml(assetUrl(item.thumbnail))}" alt="${escapeHtml(item.title)}">
<div class="card-body">
${createNewBadge(item)}
${createRecommendBadge(item)}
<h3>${escapeHtml(item.title)}</h3>
<p>${createStars(item.level)}</p>
</div>
</a>`;
}

function renderSeries(item){
    const seriesArea = document.getElementById("seriesArea");
    const currentSeries = toArray(item.series);
    if(!seriesArea || currentSeries.length === 0){ return; }
    const seriesWorks = works.filter(other =>
        other.id !== item.id &&
        toArray(other.series).some(series => currentSeries.includes(series))
    );
    if(seriesWorks.length){
        seriesArea.innerHTML = `
<h2 class="section-title">📚 同じシリーズ</h2>
<div class="card-grid">${seriesWorks.map(createWorkCard).join("")}</div>`;
    }
}

function renderRelated(item){
    const relatedArea = document.getElementById("relatedArea");
    if(!relatedArea){ return; }
    const currentCategories = toArray(item.category);
    const currentFixedTags = toArray(item.fixedTags);
    const currentFreeTags = toArray(item.freeTags);
    const relatedWorks = works.filter(other => {
        if(other.id === item.id){ return false; }
        return (
            toArray(other.category).some(value => currentCategories.includes(value)) ||
            toArray(other.fixedTags).some(value => currentFixedTags.includes(value)) ||
            toArray(other.freeTags).some(value => currentFreeTags.includes(value))
        );
    }).slice(0, 4);
    if(relatedWorks.length){
        relatedArea.innerHTML = `
<h2 class="section-title">💡 関連作品</h2>
<div class="card-grid">${relatedWorks.map(createWorkCard).join("")}</div>`;
    }
}

function renderMovement(item){
    const moveArea = document.getElementById("moveArea");
    if(!moveArea){ return; }
    const index = works.findIndex(other => other.id === item.id);
    const prev = works[index - 1];
    const next = works[index + 1];
    moveArea.innerHTML = `
<div class="section" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:15px;">
${prev ? `<a class="button" href="${workUrl(prev)}">⬅ 前の作品</a>` : "<div></div>"}
${next ? `<a class="button" href="${workUrl(next)}">次の作品 ➜</a>` : ""}
</div>`;
}

if(!work){
    if(area){
        area.innerHTML = `
<section class="container">
<h2>作品が見つかりませんでした。</h2>
<p>URLをご確認ください。</p>
<a class="button" href="${pageUrl("library.html")}">作品一覧へ戻る</a>
</section>`;
    }
}else{
    // SEOページはHTML本文を保持し、既存の通常ページだけ本文を生成する。
    if(area && !isSeoWorkPage){
        area.innerHTML = createWorkMarkup(work);
    }

    setupTagClickEvents();
    setupPdfDownload(work);
    renderSeries(work);
    renderRelated(work);
    renderMovement(work);
    activateWorkAds();

    // SEOページでは静的HTMLのheadを維持する。
    if(!isSeoWorkPage){
        document.title = `${safeString(work.title)} | Project Library`;
        const description = document.querySelector('meta[name="description"]');
        if(description){
            description.setAttribute(
                "content",
                `${safeString(work.title)}｜${safeString(work.description)}`
            );
        }
    }

    console.log("公開日 :", work.publishDate);
    console.log("更新日 :", work.updateDate);
}

console.log("Project Library work.js Version 5.7");
