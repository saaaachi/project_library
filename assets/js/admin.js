// ==========================
// Project Library
// admin.js
// Version 4.0
// ==========================

// --------------------------
// フォーム
// --------------------------

const form = document.getElementById("workForm");

const draftButton = document.querySelector(".draft");
const publishButton = document.querySelector(".publish");

const thumbnailInput = document.getElementById("thumbnail");
const pdfInput = document.getElementById("pdf");

const preview = document.querySelector(".thumbnail-preview");

const workList = document.getElementById("workList");

// --------------------------
// 編集ID
// --------------------------

let editId = null;

// --------------------------
// 投稿データ
// Version4からここへまとめる
// --------------------------

let workData = {

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

// --------------------------
// サムネイルプレビュー
// （Version4では後でPDF自動生成へ変更）
// --------------------------

// --------------------------
// サムネイル画像選択
// --------------------------

thumbnailInput.addEventListener("change", function(){

    const file = this.files[0];

    if(!file){

        preview.innerHTML = "サムネイルプレビュー";

        workData.thumbnail = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        workData.thumbnail = e.target.result;

        preview.innerHTML = `

<img
src="${workData.thumbnail}"
style="
width:100%;
height:100%;
object-fit:cover;
border-radius:10px;
">

`;

    };

    reader.readAsDataURL(file);

});

// --------------------------
// PDF選択
// Version4では次回ここを強化
// --------------------------

pdfInput.addEventListener("change", function(){

    const file = this.files[0];

    if(!file){

        return;

    }

    console.log("PDF選択:", file.name);

});
// --------------------------
// 一覧表示
// --------------------------

function renderList(){

    if(!workList) return;

    let html = "";

    works.forEach(work=>{

        html += `

<tr>

<td>

${work.workNo}

</td>

<td>

${work.title}

</td>

<td>

${work.category.join("・")}

</td>

<td>

${createStars(work.level)}

</td>

<td>

<button
class="edit-button"
onclick="editWork(${work.id})">

編集

</button>

<button
class="delete-button"
onclick="deleteWork(${work.id})">

削除

</button>

</td>

</tr>

`;

    });

    workList.innerHTML = html;

}

// --------------------------
// ★表示
// --------------------------

function createStars(level){

    if(level === 1) return "★☆☆";

    if(level === 2) return "★★☆";

    if(level === 3) return "★★★";

    return "";

}

// --------------------------
// 編集
// --------------------------

function editWork(id){

    const work = works.find(item=>item.id===id);

    if(!work) return;

    editId = id;

    // Version4では
    // 編集中のデータを丸ごとコピーして保持

    workData = structuredClone(work);

    document.getElementById("title").value =
        workData.title;

    document.getElementById("fixedTags").value =
        workData.fixedTags.join(",");

    document.getElementById("freeTags").value =
        workData.freeTags.join(",");

    document.getElementById("series").value =
        workData.series;

    document.getElementById("difficulty").value =
        workData.level;

    document.getElementById("age").value =
        workData.age;

    document.getElementById("size").value =
        workData.size;

    document.getElementById("tools").value =
        workData.tools.join(",");

    document.getElementById("description").value =
        workData.description;

    document
        .querySelectorAll('.check-group input[type="checkbox"]')
        .forEach(box=>{

            box.checked = workData.category.includes(box.value);

        });

    preview.innerHTML = `

<img
src="${workData.thumbnail}"
style="
width:100%;
height:100%;
object-fit:cover;
border-radius:10px;
">

`;

    publishButton.textContent = "更新する";

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}
// --------------------------
// 削除
// --------------------------

function deleteWork(id){

    const work = works.find(item=>item.id===id);

    if(!work) return;

    const ok = confirm(

        `「${work.title}」を削除しますか？`

    );

    if(!ok) return;

    const index = works.findIndex(item=>item.id===id);

    if(index !== -1){

        works.splice(index,1);

    }

    // 編集中だったら解除

    if(editId === id){

        editId = null;

        form.reset();

        preview.innerHTML = "サムネイルプレビュー";

        publishButton.textContent = "公開する";

    }

    renderList();

}

// --------------------------
// フォーム内容取得
// Version4新機能
// --------------------------

function collectFormData(){

    workData.title =
        document.getElementById("title").value.trim();

    workData.fixedTags =
        document.getElementById("fixedTags")
        .value
        .split(",")
        .map(tag=>tag.trim())
        .filter(tag=>tag);

    workData.freeTags =
        document.getElementById("freeTags")
        .value
        .split(",")
        .map(tag=>tag.trim())
        .filter(tag=>tag);

    workData.series =
        document.getElementById("series").value.trim();

    workData.level =
        Number(document.getElementById("difficulty").value);

    workData.age =
        document.getElementById("age").value.trim();

    workData.size =
        document.getElementById("size").value;

    workData.tools =
        document.getElementById("tools")
        .value
        .split(",")
        .map(tool=>tool.trim())
        .filter(tool=>tool);

    workData.description =
        document.getElementById("description").value.trim();

    workData.category = [];

    document
        .querySelectorAll('.check-group input[type="checkbox"]:checked')
        .forEach(box=>{

            workData.category.push(box.value);

        });

}
// --------------------------
// 公開・更新
// --------------------------

publishButton.addEventListener("click", function(){

    // フォーム内容を取得
    collectFormData();

    if(workData.title === ""){

        alert("タイトルを入力してください。");

        return;

    }

    const today = new Date().toISOString().slice(0,10);

    if(editId){

        // --------------------------
        // 更新
        // --------------------------

        const index = works.findIndex(item=>item.id===editId);

        workData.id = editId;

        workData.workNo = works[index].workNo;

        workData.thumbnail = works[index].thumbnail;

        workData.pdf = works[index].pdf;

        workData.publishDate = works[index].publishDate;

        workData.updateDate = today;

        workData.isNew = works[index].isNew;

        workData.recommend = works[index].recommend;

        workData.etsy = works[index].etsy;

        workData.related = works[index].related;

        works[index] = structuredClone(workData);

        alert("作品を更新しました😊");

    }else{

        // --------------------------
        // 新規追加
        // --------------------------

        workData.id = Date.now();

        workData.workNo =
            "PL-" +
            String(works.length + 1).padStart(6,"0");

        workData.thumbnail =
            "assets/images/sample.jpg";

        workData.pdf = "";

        workData.publishDate = today;

        workData.updateDate = today;

        workData.isNew = true;

        workData.recommend = false;

        workData.etsy = "";

        workData.related = [];

        works.unshift(

            structuredClone(workData)

        );

        alert("作品を追加しました😊");

    }

    // --------------------------
    // 初期化
    // --------------------------

    editId = null;

    form.reset();

    preview.innerHTML = "サムネイルプレビュー";

    publishButton.textContent = "公開する";

    workData = {

        id:null,

        workNo:"",

        title:"",

        category:[],

        fixedTags:[],

        freeTags:[],

        series:"",

        level:1,

        age:"",

        size:"A4",

        tools:[],

        description:"",

        thumbnail:"",

        pdf:"",

        isNew:true,

        recommend:false,

        publishDate:"",

        updateDate:"",

        etsy:"",

        related:[]

    };

    renderList();

});

// --------------------------
// 初回表示
// --------------------------

renderList();

console.log(

    "Project Library admin.js Version4.0"

);
