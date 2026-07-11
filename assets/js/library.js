// ==========================
// Project Library
// library.js
// Version 1.0
// ==========================

const cardArea = document.getElementById("cardArea");

function createStars(level){

    if(level === 1) return "★☆☆";
    if(level === 2) return "★★☆";
    if(level === 3) return "★★★";

    return "";
}

function createCard(work){

    return `
    <a href="work.html?id=${work.id}" class="card">

        <img src="${work.thumbnail}" alt="${work.title}">

        <div class="card-body">

            <h3>${work.title}</h3>

            <p>${createStars(work.difficulty)}</p>

        </div>

    </a>
    `;
}

function loadWorks(){

    let html = "";

    works.forEach(work=>{

        html += createCard(work);

    });

    cardArea.innerHTML = html;

}

loadWorks();
