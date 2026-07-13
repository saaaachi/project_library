// ==========================
// Project Library
// admin.js
// Version 1.0
// ==========================

const form = document.getElementById("workForm");

const draftButton = document.querySelector(".draft");
const publishButton = document.querySelector(".publish");

// --------------------------
// 下書き保存
// --------------------------

draftButton.addEventListener("click", function(){

    alert("下書き保存機能はVersion1.1で実装予定です。");

});

// --------------------------
// 公開
// --------------------------

publishButton.addEventListener("click", function(){

    const title = document.getElementById("title").value;

    if(title.trim()===""){

        alert("タイトルを入力してください。");
        return;

    }

    alert(
        "「" + title + "」を公開します。\n\nVersion1.0では投稿確認のみ行います。"
    );

});

// --------------------------
// サムネイルプレビュー
// --------------------------

const thumbnailInput = document.getElementById("thumbnail");

const preview = document.querySelector(".thumbnail-preview");

thumbnailInput.addEventListener("change", function(){

    const file = this.files[0];

    if(!file){

        preview.innerHTML="サムネイルプレビュー";
        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        preview.innerHTML =
        `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`;

    };

    reader.readAsDataURL(file);

});
