// ==========================
// Project Library
// admin.js
// Version 4.3
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
// --------------------------

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

let workData = createEmptyWorkData();

// --------------------------
// ★表示
// --------------------------

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
// サムネイル画像選択
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

        const thumbnail =

            await createThumbnail(file);

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

    const work = works.find(

        item => item.id === id

    );

    if(!work){

        return;

    }

    editId = id;

    // 編集データをコピー

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

    const work = works.find(

        item => item.id === id

    );

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

        item => item.id === id

    );

    if(index !== -1){

        works.splice(index,1);

    }

    if(editId === id){

        resetForm();

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
        .map(tag => tag.trim())
        .filter(tag => tag);

    workData.freeTags =
        document.getElementById("freeTags")
        .value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);

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
        .map(tool => tool.trim())
        .filter(tool => tool);

    workData.description =
        document.getElementById("description")
        .value
        .trim();

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
// 作品データ生成
// --------------------------

function generateWorkData(){

    collectFormData();

    const today =
        new Date().toISOString().slice(0,10);

    if(editId){

        const oldWork = works.find(

            item => item.id === editId

        );

        workData.id = oldWork.id;

        workData.workNo = oldWork.workNo;

        workData.thumbnail =
            workData.thumbnail || oldWork.thumbnail;

        workData.pdf =
            workData.pdf || oldWork.pdf;

        workData.publishDate =
            oldWork.publishDate;

        workData.updateDate =
            today;

        workData.isNew =
            oldWork.isNew;

        workData.recommend =
            oldWork.recommend;

        workData.etsy =
            oldWork.etsy;

        workData.related =
            oldWork.related;

    }else{

        workData.id = Date.now();

        workData.workNo =
            "PL-" +
            String(works.length + 1)
            .padStart(6,"0");

        workData.publishDate =
            today;

        workData.updateDate =
            today;

        workData.isNew = true;

        workData.recommend = false;

        workData.etsy = "";

        workData.related = [];

    }

    return structuredClone(workData);

}
// --------------------------
// 作品保存
// Version4.3
// --------------------------

function saveWork(newWork){

    if(editId){

        const index = works.findIndex(

            item => item.id === editId

        );

        works[index] = newWork;

        alert("作品を更新しました😊");

    }else{

        works.unshift(newWork);

        alert("作品を追加しました😊");

    }

}

// --------------------------
// フォーム初期化
// Version4.3
// --------------------------

function resetForm(){

    editId = null;

    form.reset();

    resetThumbnail();

    publishButton.textContent =

        "公開する";

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
// works.js形式へ変換
// Version4.3
// --------------------------

function exportWorkData(work){

    return JSON.stringify(

        work,

        null,

        4

    );

}
// --------------------------
// 公開・更新
// Version4.3
// --------------------------

publishButton.addEventListener(

    "click",

    function(){

        // --------------------------
        // データ生成
        // --------------------------

        const newWork = generateWorkData();

        // --------------------------
        // 入力チェック
        // --------------------------

        if(newWork.title === ""){

            alert("タイトルを入力してください。");

            return;

        }

        if(newWork.category.length === 0){

            alert("カテゴリを選択してください。");

            return;

        }

        if(newWork.description === ""){

            alert("説明を入力してください。");

            return;

        }

        // --------------------------
        // 保存
        // --------------------------

        saveWork(newWork);

        // --------------------------
        // 完成データ表示
        // --------------------------

        console.log(

            exportWorkData(newWork)

        );

        // --------------------------
        // 初期化
        // --------------------------

        resetForm();

        // --------------------------
        // 一覧更新
        // --------------------------

        renderList();

    }

);

// --------------------------
// 下書き保存
// （Version5予定）
// --------------------------

draftButton.addEventListener(

    "click",

    function(){

        alert(

            "下書き保存はVersion5で実装予定です😊"

        );

    }

);
// --------------------------
// 初回表示
// --------------------------

resetForm();

renderList();

// --------------------------
// Version表示
// --------------------------

console.log(

    "Project Library admin.js Version4.3"

);
