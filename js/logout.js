if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "./index.html";
}


let closeSesion = document.getElementById("cerrar")

closeSesion.addEventListener('click', function(){
    history.replaceState({}, "", "./index.html");
    window.location.href = "./index.html";
    localStorage.removeItem("isLoggedIn");
})
