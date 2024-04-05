let scanner = new Instascan.Scanner({ video: document.getElementById('camara') });
Instascan.Camera.getCameras().then(function (cameras) {
if (cameras.length > 0) {
    scanner.start(cameras[0]);
} else {
    console.error('No cameras found.');
}
}).catch(function (e) {
    console.error(e);
});

let scanData;
let showRegistro = document.getElementById("mostrarRegistro")
const audio = new Audio("./sounds/success.mp3")

scanner.addListener('scan', function (content) {
    scanData = parseInt(content, 10)

    const code = scanData;

    // Verificar si el DNI ya fue registrado recientemente
    const registroAnterior = localStorage.getItem(code);
    if (registroAnterior) {
        const tiempoTranscurrido = new Date().getTime() - parseInt(registroAnterior);
        const tiempoEspera = 30 * 1000; // 30 segundos en milisegundos

        if (tiempoTranscurrido < tiempoEspera) {
            Swal.fire({
                icon: "warning",
                title: "Este DNI ya fue registrado recientemente. Debes esperar.",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
    }

    fetch('http://192.168.1.117:3000/api/empleado')
        .then((response) => response.json())
        .then((datos) => {       

            const empleado = Object.values(datos)
            const now = new Date();
            const day = now.getDay().toString().padStart(2, "0");
            const month = (now.getMonth() + 1).toString().padStart(2, "0");
            const year = now.getFullYear();
            const fechaActual = `${year}-${month}-${day}`;
            let empleadoEncontrado = false;

            let horario = "";

            for (let i = 0; i < empleado.length; i++) {                        
                if (code == empleado[i].dni) {
                    const horaEncontrado = now.toLocaleTimeString();
                    // const horaEncontrado = "12:25";
                    nombre = empleado[i].nombres
                    apellido = empleado[i].apellidos
                    idTrabajador = empleado[i].id

                    //GUARDAR DATOS EN TABLA Y DATABASE
                    if (horaEncontrado < "11:11:00") {
                        // Registra como entrada
                        entradaMañana(idTrabajador, fechaActual, horaEncontrado,null,null,null)
                        horario = "am"
                    } else if (horaEncontrado >= "12:00:00" && horaEncontrado < "13:00:00") {
                        // Registra como salida al mediodía
                        salidaMañana(idTrabajador, fechaActual, horaEncontrado)
                        horario = "pm"
                    } else if (horaEncontrado > "13:00:00" && horaEncontrado <= "14:00:00") {
                        // Registra como entrada en la tarde
                        entradaTarde(idTrabajador,fechaActual,horaEncontrado)
                        horario = "pm"
                    } else if (horaEncontrado >= "18:00:00") {
                        // Registra como salida
                        salidaTarde(idTrabajador,fechaActual,horaEncontrado)
                        horario = "pm"
                    } else {
                        Swal.fire({
                            icon: "warning",
                            title: "Aún en horario laboral",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        break;
                    }

                    //MOSTRANDO DATOS EN PANTALLA
                    const nuevoElemento = document.createElement('div');
                    nuevoElemento.classList.add("usuario__registrado")
                    nuevoElemento.innerHTML = `<div class="nombre">
                                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                                    <h3>${nombre} ${apellido}</h3>
                                                </div>
                                                <div class="hora">
                                                    <i class="fa-solid fa-clock"></i>
                                                    ${horaEncontrado} ${horario}
                                                </div>`

                    showRegistro.insertBefore(nuevoElemento, showRegistro.firstChild);
                    // Registrar el DNI y la hora actual en el almacenamiento local
                    localStorage.setItem(code, now.getTime().toString());
                    empleadoEncontrado = true;
                    audio.play();
                    break;
                }                         
            }
            if (showRegistro.children.length > 8) {
                showRegistro.removeChild(showRegistro.lastChild);
            }
            if (!empleadoEncontrado) {
                console.log('DNI no encontrado en la base de datos.');
            }
        })
});

function entradaMañana(empleado, fecha, eM, sM, eT, sT){

    axios.post('http://192.168.1.117:3000/api/asistencia',{
        idempleado: empleado,
        fecha: fecha,
        entrada_mañana: eM,
        salida_mañana: sM,
        entrada_tarde: eT,
        salida_tarde: sT
    })
    .then(function (response) {
    })
    .catch(function (error) {
        console.log(error);
    });
}

function salidaMañana(empleado, fechaActual, salidaMañana) {
    fetch('http://192.168.1.117:3000/api/asistencia')
        .then((response) => response.json())
        .then((datos) => {
            
            for (let i = 0; i < datos.length; i++) {

                const fechaBaseDatos = datos[i].fecha;
                const fechaBd = new Date(fechaBaseDatos);
                const anio = fechaBd.getFullYear();
                const mes = (fechaBd.getMonth() + 1).toString().padStart(2, "0"); // Añade un cero al mes si es necesario
                const dia = fechaBd.getDate().toString().padStart(2, "0"); // Añade un cero al día si es necesario
                const fechaFormateada = `${anio}-${mes}-${dia}`;
                
                if (empleado == datos[i].idempleado && fechaFormateada == fechaActual) {

                    id = datos[i].id
                    
                    axios.patch(`http://192.168.1.117:3000/api/asistencia/${id}`,{
                        salida_mañana: salidaMañana
                    })
                    .then(function (response) {
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }         
            }
        })
}

function entradaTarde(empleado, fechaActual, entradaTarde) {
    fetch('http://192.168.1.117:3000/api/asistencia')
        .then((response) => response.json())
        .then((datos) => {
            
            for (let i = 0; i < datos.length; i++) {

                const fechaBaseDatos = datos[i].fecha;
                const fechaBd = new Date(fechaBaseDatos);
                const anio = fechaBd.getFullYear();
                const mes = (fechaBd.getMonth() + 1).toString().padStart(2, "0"); // Añade un cero al mes si es necesario
                const dia = fechaBd.getDate().toString().padStart(2, "0"); // Añade un cero al día si es necesario
                const fechaFormateada = `${anio}-${mes}-${dia}`;
                
                if (empleado == datos[i].idempleado && fechaFormateada == fechaActual) {

                    id = datos[i].id
                    
                    axios.patch(`http://192.168.1.117:3000/api/asistencia/${id}`,{
                        entrada_tarde: entradaTarde
                    })
                    .then(function (response) {
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }         
            }
        })
}

function salidaTarde(empleado, fechaActual, salidaTarde) {
    fetch('http://192.168.1.117:3000/api/asistencia')
        .then((response) => response.json())
        .then((datos) => {
            
            for (let i = 0; i < datos.length; i++) {

                const fechaBaseDatos = datos[i].fecha;
                const fechaBd = new Date(fechaBaseDatos);
                const anio = fechaBd.getFullYear();
                const mes = (fechaBd.getMonth() + 1).toString().padStart(2, "0"); // Añade un cero al mes si es necesario
                const dia = fechaBd.getDate().toString().padStart(2, "0"); // Añade un cero al día si es necesario
                const fechaFormateada = `${anio}-${mes}-${dia}`;
                
                if (empleado == datos[i].idempleado && fechaFormateada == fechaActual) {

                    id = datos[i].id
                    
                    axios.patch(`http://192.168.1.117:3000/api/asistencia/${id}`,{
                        salida_tarde: salidaTarde
                    })
                    .then(function (response) {
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }         
            }
        })
}

///////////////////////////////////

const cards = document.querySelectorAll(".card")
let caja = document.querySelector(".asistencia")
let opciones = document.querySelector(".opciones")
const btnMenu = document.getElementById("backMenu")

cards.forEach(function(card) {
    card.addEventListener('click', function() {
        caja.style.display = "flex"
        opciones.style.display = "none"
        btnMenu.style.display = "block"
    });
});

btnMenu.addEventListener('click',function(){
    caja.style.display = "none"
    opciones.style.display = "block"
    btnMenu.style.display = "none"
    location.reload()
})