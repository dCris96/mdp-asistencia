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

scanner.addListener('scan', function (content) {
    scanData = parseInt(content, 10)

    console.log(scanData);

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

    fetch('https://restapimdpempleado-production.up.railway.app/api/empleado')
        .then((response) => response.json())
        .then((datos) => {                    
            const empleado = Object.values(datos)
            const now = new Date();
            let empleadoEncontrado = false;
            for (let i = 0; i < empleado.length; i++) {                        
                if (code == empleado[i].dni) {
                    const horaEncontrado = now.toLocaleTimeString();
                    nombre = empleado[i].nombres
                    apellido = empleado[i].apellidos

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
                    break;
                }                         
            }
            if (!empleadoEncontrado) {
                console.log('DNI no encontrado en la base de datos.');
            }
        })
});