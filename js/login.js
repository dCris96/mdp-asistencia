function logear(){
    let usuario = document.getElementById("user").value;
    let password = document.getElementById("pass").value;
  
    if(usuario === "rrhh" && password === "rrhh@2024-MDP"){
            localStorage.setItem("isLoggedIn", true);
            history.replaceState({}, "", "./dashboard.html");
            window.location = "./dashboard.html";
    } else {
        alert("datos incorrectos")
    }
  }
  