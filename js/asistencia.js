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
            console.log('Este DNI ya fue registrado recientemente. Debes esperar.');
            return;
        }
    }

    fetch('http://localhost:3000/api/empleado')
        .then((response) => response.json())
        .then((datos) => {                    
            const empleado = Object.values(datos)
            const now = new Date();
            const fechaActual = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()}`
            let empleadoEncontrado = false;
            for (let i = 0; i < empleado.length; i++) {                        
                if (code == empleado[i].dni) {
                    //const horaEncontrado = now.toLocaleTimeString();
                    const horaEncontrado = "07:56";
                    nombre = empleado[i].nombres
                    apellido = empleado[i].apellidos
                    idTrabajador = empleado[i].id

                    //GUARDAR DATOS EN TABLA Y DATABASE
                    if (horaEncontrado < "08:00:00") {
                        // Registra como entrada
                        entradaMañana(idTrabajador, fechaActual, horaEncontrado,null,null,null)
                    } else if (horaEncontrado >= "12:00:00" && horaEncontrado < "13:00:00") {
                        // Registra como salida al mediodía
                        console.log("SALIDA EN LA MAÑANA");
                    } else if (horaEncontrado > "13:00:00" && horaEncontrado < "14:00:00") {
                        // Registra como entrada en la tarde
                        console.log("ENTRADA EN LA TARDE");
                    } else if (horaEncontrado > "18:00:00") {
                        // Registra como salida
                        console.log("SALIDA EN LA TARDE");
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
                                                    <h3>${nombre} ${apellido}</h3>
                                                </div>
                                                <div class="hora">
                                                    ${horaEncontrado}
                                                </div>`

                    showRegistro.appendChild(nuevoElemento);
                    // Registrar el DNI y la hora actual en el almacenamiento local
                    localStorage.setItem(code, now.getTime().toString());
                    empleadoEncontrado = true;
                    audio.play();
                    break;
                }                         
            }
            if (!empleadoEncontrado) {
                console.log('DNI no encontrado en la base de datos.');
            }
        })
});

function entradaMañana(empleado, fecha, eM, sM, eT, sT){
    const idEmpleado = empleado;
    const fechaHoy = fecha;
    const entradaMañana = eM;
    const salidaMañana = sM;
    const entradaTarde = eT;
    const salidaTarde = sT;

    const data = {
        idEmpleado,
        fechaHoy,
        entradaMañana,
        salidaMañana,
        entradaTarde,
        salidaTarde,
    }

    fetch(`http://localhost:3000/api/asistencia`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(response => console.log(response))
    .then(responseData => {
        // Maneja la respuesta de la API (puede ser un mensaje de éxito o error)
        console.log(data);
    })
    .catch(error => {
        console.error('Error al enviar la solicitud:', error);
    });
}