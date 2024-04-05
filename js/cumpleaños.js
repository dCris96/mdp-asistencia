// Obtener los datos de los empleados.
const empleados = fetch('http://192.168.1.117:3000/api/empleado')
    .then(response => response.json())
    .then((data) => {

        mostrarCumpleañosMasCercano(data);
    })

function mostrarCumpleañosMasCercano(empleados) {
    // Obtener la fecha actual
    const fechaActual = new Date();
    const diaActual = fechaActual.getDate();
    const mesActual = fechaActual.getMonth() + 1; // Nota: Los meses en JavaScript comienzan desde 0
  
    // Calcular la proximidad de los cumpleaños
    const cumpleañosProximos = empleados.map((empleado) => {
        const fechaCumpleaños = new Date(empleado.nacimiento);
        const diaCumple = fechaCumpleaños.getDate();
        const mesCumple = fechaCumpleaños.getMonth() + 1;

        // Calcular la proximidad
        const proximidad = Math.abs(mesCumple - mesActual) * 100 + Math.abs(diaCumple - diaActual);

        return {
            empleado,
            proximidad
        };
    });
  
    // Ordenar los cumpleaños por proximidad
    cumpleañosProximos.sort((a, b) => a.proximidad - b.proximidad);

    // Seleccionar los dos cumpleaños más cercanos
    const cumpleañosCercanos = cumpleañosProximos.slice(0, 2);

    let contentHappy = document.querySelector(".cumple")

      //Mostrar los cumpleaños en el sidebar
    cumpleañosCercanos.forEach((cumpleaños) => {
        let strNombre = cumpleaños.empleado.nombres
        let strApellido = cumpleaños.empleado.apellidos
        let nombre = strNombre.split(" ")[0];
        let apellido = strApellido.split(" ")[0];

        let fecha = formatFecha(cumpleaños.empleado.nacimiento);
        var partes = fecha.split('/');
        var dia = partes[0];
        var mes = partes[1];
        
        contentHappy.innerHTML += `
        <div class="cumpleañero">
            <div class="icono">
                <lord-icon
                    src="https://cdn.lordicon.com/fkmafinl.json"
                    trigger="loop"
                    delay="1500"
                    state="in-reveal"
                    style="width:50px;height:50px">
                </lord-icon>
            </div>
            <div class="nombre">
                <h5 id="happyNombre">${nombre + " " + apellido}</h5>
                <p id="happyCargo">${cumpleaños.empleado.cargo}</p>
            </div>
            <div class="fecha">
                <h6 id="happyFecha">${dia} del ${mes}</h6>
            </div>
        </div>
        `

    });
  }

function formatFecha(nacimiento) {
    const fecha = new Date(nacimiento);
    fecha.setHours(fecha.getHours() + fecha.getTimezoneOffset() / 60);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', options)
}