// ==========================
// Project Library
// admin.js
// Version 3.0
// ==========================

const form = document.getElementById("workForm");

const draftButton = document.querySelector(".draft");
const publishButton = document.querySelector(".publish");

const thumbnailInput = document.getElementById("thumbnail");
const preview = document.querySelector(".thumbnail-preview");

const workList = document.getElementById("workList");
const searchWork = document.getElementById("searchWork");

let editId = null;

// --------------------------
// サムネイルプレビュー
// --------------------------

thumbnailInput.addEventListener("change", function(){

    const file = this.files[0];

    if(!file){

        preview.innerHTML = "サムネイルプレビュー";
        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        preview.innerHTML = `

<img
src="${e.target.result}"
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
// 一覧表示
// --------------------------

function renderList(){

    if(!workList) return;

    const keyword = searchWork
        ? searchWork.value.toLowerCase()
        : "";

    let html = "";

    works
    .filter(work=>{

        return work.title
            .toLowerCase()
            .includes(keyword);

    })
    .forEach(work=>{

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

${work.publishDate}

</td>

<td>

${work.updateDate}

</td>

<td>

${work.isNew ? "🟢公開" : "⚪公開"}

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

    const work = works.find(item => item.id === id);

    if(!work) return;

    editId = id;

    document.getElementById("title").value =
        work.title;

    document.getElementById("fixedTags").value =
        work.fixedTags.join(",");

    document.getElementById("freeTags").value =
        work.freeTags.join(",");

    document.getElementById("series").value =
        work.series;

    document.getElementById("difficulty").value =
        work.level;

    document.getElementById("age").value =
        work.age;

    document.getElementById("size").value =
        work.size;

    document.getElementById("tools").value =
        work.tools.join(",");

    document.getElementById("description").value =
        work.description;

    // --------------------------
    // カテゴリ復元
    // --------------------------

    document
        .querySelectorAll(
            '.check-group input[type="checkbox"]'
        )
        .forEach(box=>{

            box.checked =
                work.category.includes(box.value);

        });

    // --------------------------
    // サムネイル表示
    // --------------------------

    preview.innerHTML = `

<img
src="${work.thumbnail}"
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

    const index = works.findIndex(item=>

        item.id===id

    );

    if(index !== -1){

        works.splice(index,1);

    }

    renderList();

    // 編集中なら解除

    if(editId === id){

        editId = null;

        form.reset();

        preview.innerHTML = "サムネイルプレビュー";

        publishButton.textContent = "公開する";

    }

}

// --------------------------
// 公開・更新
// --------------------------

publishButton.addEventListener("click", function(){

    const title =
        document.getElementById("title")
        .value
        .trim();

    if(title === ""){

        alert("タイトルを入力してください。");

        return;

    }

    if(editId){

        // --------------------------
        // 更新
        // --------------------------

        const work = works.find(item=>

            item.id === editId

        );

        work.title = title;

        work.fixedTags =
            document.getElementById("fixedTags")
            .value
            .split(",")
            .map(tag=>tag.trim())
            .filter(tag=>tag);

        work.freeTags =
            document.getElementById("freeTags")
            .value
            .split(",")
            .map(tag=>tag.trim())
            .filter(tag=>tag);

        work.series =
            document.getElementById("series").value;

        work.level =
            Number(
                document.getElementById("difficulty").value
            );

        work.age =
            document.getElementById("age").value;

        work.size =
            document.getElementById("size").value;

        work.tools =
            document.getElementById("tools")
            .value
            .split(",")
            .map(tool=>tool.trim())
            .filter(tool=>tool);

        work.description =
            document.getElementById("description").value;

        work.category = [];

        document
            .querySelectorAll(
                '.check-group input[type="checkbox"]:checked'
            )
            .forEach(box=>{

                work.category.push(box.value);

            });

        work.updateDate =
            new Date().toISOString().slice(0,10);

        alert("作品を更新しました😊");

    }else{

        // --------------------------
        // 新規追加
        // --------------------------

        const newWork = {

            id: Date.now(),

            workNo: "PL-" + Date.now(),

            title: title,

            category: [],

            fixedTags:
                document.getElementById("fixedTags")
                .value
                .split(",")
                .map(tag=>tag.trim())
                .filter(tag=>tag),

            freeTags:
                document.getElementById("freeTags")
                .value
                .split(",")
                .map(tag=>tag.trim())
                .filter(tag=>tag),

            series:
                document.getElementById("series").value,

            level:
                Number(
                    document.getElementById("difficulty").value
                ),

            age:
                document.getElementById("age").value,

            size:
                document.getElementById("size").value,

            tools:
                document.getElementById("tools")
                .value
                .split(",")
                .map(tool=>tool.trim())
                .filter(tool=>tool),

            description:
                document.getElementById("description").value,

            thumbnail:
                "assets/images/sample.jpg",

            pdf:
                "",

            isNew: true,

            recommend: false,

            publishDate:
                new Date().toISOString().slice(0,10),

            updateDate:
                new Date().toISOString().slice(0,10),

            etsy: "",

            related: []

        };

        document
            .querySelectorAll(
                '.check-group input[type="checkbox"]:checked'
            )
            .forEach(box=>{

                newWork.category.push(box.value);

            });

        works.unshift(newWork);

        alert("作品を追加しました😊");

    }

    editId = null;

    form.reset();

    preview.innerHTML = "サムネイルプレビュー";

    publishButton.textContent = "公開する";

    renderList();

});

// --------------------------
// 下書き保存
// --------------------------

draftButton.addEventListener("click", function(){

    alert(

        "Version3.0では下書き保存は準備中です😊"

    );

});

// --------------------------
// 一覧検索
// --------------------------

if(searchWork){

    searchWork.addEventListener("input", function(){

        renderList();

    });

}

// --------------------------
// 初回表示
// --------------------------

renderList();

// --------------------------
// Version情報
// --------------------------

console.log(

    "Project Library admin.js Version 3.0"

);
