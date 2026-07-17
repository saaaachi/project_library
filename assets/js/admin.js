// ==========================
// Project Library
// admin.js
// Version 4.1
// ==========================

// --------------------------
// フォーム
// --------------------------

const form = document.getElementById("workForm");

const draftButton = document.querySelector(".draft");
const publishButton = document.querySelector(".publish");

const thumbnailInput =
    document.getElementById("thumbnail");

const pdfInput =
    document.getElementById("pdf");

const preview =
    document.querySelector(".thumbnail-preview");

const workList =
    document.getElementById("workList");

// --------------------------
// 編集中ID
// --------------------------

let editId = null;

// --------------------------
// 投稿データ
// Version4から一元管理
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
// ★表示
// --------------------------

function createStars(level){

    if(level === 1) return "★☆☆";

    if(level === 2) return "★★☆";

    if(level === 3) return "★★★";

    return "";

}

// --------------------------
// サムネイル表示
// --------------------------

function showThumbnail(image){

    preview.innerHTML = `

<img
src="${image}"
style="
width:100%;
height:100%;
object-fit:cover;
border-radius:10px;
">

`;

}

// --------------------------
// サムネイル初期化
// --------------------------

function resetThumbnail(){

    preview.innerHTML =
        "サムネイルプレビュー";

}

// --------------------------
// 画像選択
// --------------------------

thumbnailInput.addEventListener(

    "change",

    function(){

        const file = this.files[0];

        if(!file){

            workData.thumbnail = "";

            resetThumbnail();

            return;

        }

        const reader = new FileReader();

        reader.onload = function(e){

            workData.thumbnail = e.target.result;

            showThumbnail(

                workData.thumbnail

            );

        };

        reader.readAsDataURL(file);

    }

);

// --------------------------
// PDF選択
// --------------------------

pdfInput.addEventListener(

    "change",

    async function(){

        const file = this.files[0];

        if(!file){

            return;

        }

        workData.pdf = file;

        console.log(

            "PDF選択：",

            file.name

        );

        // Version4.1
        // PDFからサムネイル生成

        const thumbnail = await createThumbnail(file);

        if(thumbnail){

            workData.thumbnail = thumbnail;

            showThumbnail(thumbnail);

        }

    }

);

// --------------------------
// 一覧表示
// --------------------------

function renderList(){

    if(!workList){

        return;

    }

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
// 編集
// --------------------------

function editWork(id){

    const work = works.find(item=>item.id===id);

    if(!work){

        return;

    }

    editId = id;

    // 編集用データコピー

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
        .querySelectorAll(
            '.check-group input[type="checkbox"]'
        )
        .forEach(box=>{

            box.checked =
                workData.category.includes(box.value);

        });

    if(workData.thumbnail){

        showThumbnail(workData.thumbnail);

    }else{

        resetThumbnail();

    }

    publishButton.textContent =

        "更新する";

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

    if(!work){

        return;

    }

    const ok = confirm(

        `「${work.title}」を削除しますか？`

    );

    if(!ok){

        return;

    }

    const index = works.findIndex(

        item=>item.id===id

    );

    if(index !== -1){

        works.splice(index,1);

    }

    // 編集中なら解除

    if(editId === id){

        editId = null;

        form.reset();

        resetThumbnail();

        publishButton.textContent =

            "公開する";

    }

    renderList();

}

// --------------------------
// フォーム内容取得
// --------------------------

function collectFormData(){

    workData.title =
        document.getElementById("title")
        .value
        .trim();

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
        document.getElementById("series")
        .value
        .trim();

    workData.level =
        Number(
            document.getElementById("difficulty")
            .value
        );

    workData.age =
        document.getElementById("age")
        .value
        .trim();

    workData.size =
        document.getElementById("size")
        .value;

    workData.tools =
        document.getElementById("tools")
        .value
        .split(",")
        .map(tool=>tool.trim())
        .filter(tool=>tool);

    workData.description =
        document.getElementById("description")
        .value
        .trim();

    // --------------------------
    // カテゴリ取得
    // --------------------------

    workData.category = [];

    document
        .querySelectorAll(
            '.check-group input[type="checkbox"]:checked'
        )
        .forEach(box=>{

            workData.category.push(box.value);

        });

}

// --------------------------
// 入力チェック
// --------------------------

function validateForm(){

    if(workData.title === ""){

        alert("タイトルを入力してください。");

        return false;

    }

    if(workData.category.length === 0){

        alert("カテゴリを選択してください。");

        return false;

    }

    if(workData.description === ""){

        alert("説明を入力してください。");

        return false;

    }

    return true;

}

// --------------------------
// 投稿データ初期化
// --------------------------

function resetWorkData(){

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

}

// --------------------------
// 公開・更新
// --------------------------

publishButton.addEventListener("click", function(){

    // フォーム内容取得

    collectFormData();

    // 入力チェック

    if(!validateForm()){

        return;

    }

    const today =

        new Date().toISOString().slice(0,10);

    // --------------------------
    // 更新
    // --------------------------

    if(editId){

        const index = works.findIndex(

            item=>item.id===editId

        );

        workData.id = editId;

        workData.workNo =
            works[index].workNo;

        workData.publishDate =
            works[index].publishDate;

        workData.updateDate =
            today;

        workData.isNew =
            works[index].isNew;

        workData.recommend =
            works[index].recommend;

        workData.etsy =
            works[index].etsy;

        workData.related =
            works[index].related;

        // サムネイル・PDFは
        // 新しく選択されていなければ保持

        if(!workData.thumbnail){

            workData.thumbnail =
                works[index].thumbnail;

        }

        if(!workData.pdf){

            workData.pdf =
                works[index].pdf;

        }

        works[index] =

            structuredClone(workData);

        alert("作品を更新しました😊");

    }

    // --------------------------
    // 新規追加
    // --------------------------

    else{

        workData.id = Date.now();

        workData.workNo =

            "PL-" +

            String(

                works.length + 1

            ).padStart(6,"0");

        workData.publishDate =

            today;

        workData.updateDate =

            today;

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

    resetThumbnail();

    resetWorkData();

    publishButton.textContent =

        "公開する";

    renderList();

});

// --------------------------
// 下書き保存
// （Version5で実装予定）
// --------------------------

draftButton.addEventListener("click", function(){

    alert(

        "下書き保存はVersion5で実装予定です😊"

    );

});

// --------------------------
// 初回表示
// --------------------------

resetWorkData();

resetThumbnail();

renderList();

// --------------------------
// Version表示
// --------------------------

console.log(

    "Project Library admin.js Version4.1"

);
