// ==========================
// Project Library
// pdf-thumbnail.js
// Version 4.1
// PDF Thumbnail Engine
// ==========================

// --------------------------
// PDF.js 初期設定
// --------------------------

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";

// --------------------------
// サムネイル生成
// --------------------------

async function createThumbnail(file){

    try{

        // --------------------------
        // PDF読み込み
        // --------------------------

        const arrayBuffer = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({

            data: arrayBuffer

        }).promise;

        // --------------------------
        // 1ページ取得
        // --------------------------

        const page = await pdf.getPage(1);

        const scale = 2;

        const viewport = page.getViewport({

            scale

        });

        // --------------------------
        // Canvas作成
        // --------------------------

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");

        canvas.width = viewport.width;

        canvas.height = viewport.height;

        // 次で描画します
              // --------------------------
        // PDF描画
        // --------------------------

        await page.render({

            canvasContext: context,

            viewport: viewport

        }).promise;

        // --------------------------
        // 画像データ取得
        // --------------------------

        const imageData = canvas.toDataURL("image/png");

        // --------------------------
        // プレビュー表示
        // --------------------------

        const preview =
            document.querySelector(".thumbnail-preview");

        if(preview){

            preview.innerHTML = `

<img
src="${imageData}"
style="
width:100%;
height:100%;
object-fit:cover;
border-radius:10px;
">

`;

        }

        // --------------------------
        // 戻り値
        // --------------------------

        return imageData;
              // --------------------------
        // 透かし用Canvas作成
        // --------------------------

        const watermarkCanvas = document.createElement("canvas");

        const watermarkContext =
            watermarkCanvas.getContext("2d");

        watermarkCanvas.width = canvas.width;
        watermarkCanvas.height = canvas.height;

        // 元画像をコピー

        watermarkContext.drawImage(

            canvas,

            0,

            0

        );

        // --------------------------
        // SAMPLE透かし
        // --------------------------

        watermarkContext.save();

        watermarkContext.globalAlpha = 0.18;

        watermarkContext.fillStyle = "#666";

        watermarkContext.textAlign = "center";

        watermarkContext.textBaseline = "middle";

        watermarkContext.font =
            "bold 80px sans-serif";

        watermarkContext.translate(

            watermarkCanvas.width / 2,

            watermarkCanvas.height / 2

        );

        watermarkContext.rotate(-0.5);

        watermarkContext.fillText(

            "SAMPLE",

            0,

            0

        );

        watermarkContext.restore();

        // --------------------------
        // 画像データ更新
        // --------------------------

        const thumbnailData = watermarkCanvas.toDataURL("image/png");
              // --------------------------
        // プレビュー更新
        // --------------------------

        if(preview){

            preview.innerHTML = `

<img
src="${thumbnailData}"
style="
width:100%;
height:100%;
object-fit:cover;
border-radius:10px;
">

`;

        }

        // --------------------------
        // サムネイル返却
        // --------------------------

        return thumbnailData;

    }catch(error){

        console.error(

            "サムネイル生成失敗",

            error

        );

        alert(

            "PDFの読み込みに失敗しました。"

        );

        return null;

    }

}

// ==========================
// Version4.1
// PDF Thumbnail Engine
// 完成
// ==========================
  
