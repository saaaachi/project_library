// –––––––––––––
// 一覧表示
// –––––––––––––

function renderList(){

if(!workList){
    return;
}
let html = "";
works.forEach(work => {
    html += `
<tr>
<td>${work.workNo}</td>
<td>${work.title}</td>
<td>${work.category.join("・")}</td>
<td>${createStars(work.level)}</td>
<td>

編集

</button>

削除

</button>
</td>
</tr>

`;

});
workList.innerHTML = html;

}

// –––––––––––––
// 編集
// –––––––––––––

function editWork(id){

const work =
    works.find(item => item.id === id);
if(!work){
    return;
}
editId = id;
workData =
    structuredClone(work);
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
    .forEach(box => {
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

// –––––––––––––
// 削除
// –––––––––––––

function deleteWork(id){

const work =
    works.find(item => item.id === id);
if(!work){
    return;
}
const ok = confirm(
    `「${work.title}」を削除しますか？`
);
if(!ok){
    return;
}
const index =
    works.findIndex(item => item.id === id);
if(index !== -1){
    works.splice(index,1);
}
if(editId === id){
    resetForm();
}
renderList();
updateExportArea();

}

// –––––––––––––
// フォーム内容取得
// –––––––––––––

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
        document.getElementById("difficulty").value
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
    .forEach(box => {
        workData.category.push(box.value);
    });

}

// –––––––––––––
// 入力チェック
// –––––––––––––

function validateForm(){

collectFormData();
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

// –––––––––––––
// 作品データ生成
// –––––––––––––

function generateWorkData(){

collectFormData();
const today =
    new Date().toISOString().slice(0,10);
if(editId){
    const oldWork =
        works.find(item => item.id === editId);
    workData.id =
        oldWork.id;
    workData.workNo =
        oldWork.workNo;
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
    workData.id =
        Date.now();
    workData.workNo =
        "PL-" +
        String(works.length + 1)
        .padStart(6,"0");
    workData.publishDate =
        today;
    workData.updateDate =
        today;
    workData.isNew =
        true;
    workData.recommend =
        false;
    workData.etsy =
        "";
    workData.related =
        [];
}
return structuredClone(workData);

}
// –––––––––––––
// 一覧表示
// –––––––––––––

function renderList(){

if(!workList){
    return;
}
let html = "";
works.forEach(work => {
    html += `
<tr>
<td>${work.workNo}</td>
<td>${work.title}</td>
<td>${work.category.join("・")}</td>
<td>${createStars(work.level)}</td>
<td>

編集

</button>

削除

</button>
</td>
</tr>

`;

});
workList.innerHTML = html;

}

// –––––––––––––
// 編集
// –––––––––––––

function editWork(id){

const work =
    works.find(item => item.id === id);
if(!work){
    return;
}
editId = id;
workData =
    structuredClone(work);
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
    .forEach(box => {
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

// –––––––––––––
// 削除
// –––––––––––––

function deleteWork(id){

const work =
    works.find(item => item.id === id);
if(!work){
    return;
}
const ok = confirm(
    `「${work.title}」を削除しますか？`
);
if(!ok){
    return;
}
const index =
    works.findIndex(item => item.id === id);
if(index !== -1){
    works.splice(index,1);
}
if(editId === id){
    resetForm();
}
renderList();
updateExportArea();

}

// –––––––––––––
// フォーム内容取得
// –––––––––––––

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
        document.getElementById("difficulty").value
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
    .forEach(box => {
        workData.category.push(box.value);
    });

}

// –––––––––––––
// 入力チェック
// –––––––––––––

function validateForm(){

collectFormData();
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

// –––––––––––––
// 作品データ生成
// –––––––––––––

function generateWorkData(){

collectFormData();
const today =
    new Date().toISOString().slice(0,10);
if(editId){
    const oldWork =
        works.find(item => item.id === editId);
    workData.id =
        oldWork.id;
    workData.workNo =
        oldWork.workNo;
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
    workData.id =
        Date.now();
    workData.workNo =
        "PL-" +
        String(works.length + 1)
        .padStart(6,"0");
    workData.publishDate =
        today;
    workData.updateDate =
        today;
    workData.isNew =
        true;
    workData.recommend =
        false;
    workData.etsy =
        "";
    workData.related =
        [];
}
return structuredClone(workData);

}
// –––––––––––––
// 保存
// –––––––––––––

function saveWork(newWork){

if(editId){
    const index =
        works.findIndex(
            item => item.id === editId
        );
    works[index] =
        newWork;
    alert("作品を更新しました😊");
}else{
    works.unshift(newWork);
    alert("作品を追加しました😊");
}

}

// –––––––––––––
// フォーム初期化
// –––––––––––––

function resetForm(){

editId = null;
form.reset();
resetThumbnail();
publishButton.textContent =
    "🚀 公開する（GitHub）";
workData =
    createEmptyWorkData();

}

// –––––––––––––
// works.js形式へ変換
// –––––––––––––

function exportWorkData(){

return `const works = ${JSON.stringify(
    works,
    null,
    4
)};`;

}

// –––––––––––––
// 出力欄更新
// –––––––––––––

function updateExportArea(){

if(!exportArea){
    return;
}
exportArea.value =
    exportWorkData();

}

// –––––––––––––
// コピー
// –––––––––––––

if(copyButton){

copyButton.addEventListener(
    "click",
    async function(){
        try{
            await navigator.clipboard.writeText(
                exportArea.value
            );
            copyButton.textContent =
                "✅ コピーしました！";
            setTimeout(()=>{
                copyButton.textContent =
                    "📋 コピー";
            },2000);
        }catch(error){
            alert(
                "コピーに失敗しました🥲"
            );
        }
    }
);

}

// –––––––––––––
// GitHub Actions起動
// Version6.2
// –––––––––––––

async function triggerGitHubPublish(work){

const body = {
    ref:"main",
    inputs:{
        title:work.title,
        category:work.category.join(","),
        fixedTags:work.fixedTags.join(","),
        freeTags:work.freeTags.join(",")
    }
};
console.log(
    "GitHubへ送信予定:",
    body
);
// Version6.2では
// GitHub Actionsへ渡すデータ生成まで
return true;

}
// –––––––––––––
// 公開・更新
// Version6.2
// –––––––––––––

publishButton.addEventListener(

"click",
async function(){
    if(!validateForm()){
        return;
    }
    publishButton.disabled = true;
    publishButton.textContent =
        "公開中...";
    try{
        const newWork =
            generateWorkData();
        saveWork(newWork);
        updateExportArea();
        await triggerGitHubPublish(newWork);
        console.log(
            exportWorkData()
        );
        alert(
            "GitHub投稿リクエストを送信しました😊"
        );
        resetForm();
        renderList();
    }catch(error){
        console.error(error);
        alert(
            "公開処理でエラーが発生しました🥲"
        );
    }finally{
        publishButton.disabled = false;
        publishButton.textContent =
            "🚀 公開する（GitHub）";
    }
}

);

// –––––––––––––
// 下書き保存
// Version6.3予定
// –––––––––––––

draftButton.addEventListener(

"click",
function(){
    alert(
        "Version6.3で実装予定です😊"
    );
}

);

// –––––––––––––
// 初回表示
// –––––––––––––

resetForm();

renderList();

updateExportArea();

// –––––––––––––
// Version表示
// –––––––––––––

console.log(
“Project Library admin.js Version6.2”
);
