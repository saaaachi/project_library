const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const closeMenu = document.getElementById("closeMenu");

if(menuButton){

    menuButton.onclick = () => {

        sidebar.classList.add("open");

    };

}

if(closeMenu){

    closeMenu.onclick = () => {

        sidebar.classList.remove("open");

    };

}
