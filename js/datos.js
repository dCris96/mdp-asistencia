
const tabla = new gridjs.Grid({
    language: {
        search: {
            placeholder: 'Buscar...',
            results: 'Mostrando de resultados'
        },
        pagination: {
            previous: 'Anterior',
            next: 'Siguiente',
            to: 'a',
            of: 'de',
            'showing': 'Mostrando',
            'results': () => 'Empleados'
        },
    },
    search: true,
    pagination: {
        limit: 4,
        enabled: true
    },
    columns: [
        'Dni',
        'Nombres',
        'Apellidos',
        {
            name: 'Nacimiento',
            formatter: formatFecha
        },
        'Celular',
        'Correo',
        'Cargo',
        {
            name: 'Opciones',
            formatter: formatBotones
        }
    ],
    server: {
      url: 'http://192.168.1.117:3000/api/empleado',
      then: data => data.map(card => [card.dni, card.nombres,card.apellidos, card.nacimiento,card.celular, card.correo,card.cargo,card.id])
    }
}).render(document.getElementById("table"));

//CODIGO PARA FORMATEAR LA FECHA TRAIDA
function formatFecha(cell) {
    const fecha = new Date(cell);
    fecha.setHours(fecha.getHours() + fecha.getTimezoneOffset() / 60);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', options);
}

//CODIGO PARA ICONOS PROPIOS
function formatBotones(cell, row) {
    return gridjs.h('div', {
        className: 'acciones',
    }, [
        gridjs.h('button', {
            className: 'btn__tabla btn__editar',
            onClick: () => {
                const id = row.cells[7].data; // Obtener el ID del empleado
                editar(id); // Llamar a la función editar con el ID como argumento
            }
            }, [
                gridjs.h('i', {
                    className: 'far fa-edit'
                })
            ]
        ),
        gridjs.h('button', {
            className: 'btn__tabla btn__eliminar',
            onClick: () => {
                const id = row.cells[7].data; // Obtener el ID del empleado
                eliminar(id); // Llamar a la función editar con el ID como argumento
            }
            }, [
                gridjs.h('i', {
                    className: 'far fa-trash-alt'
                })
            ]
        )
        
    ]);
}
  
//CODIGO PARA ELIMINAR UN EMPLEADO
function eliminar(id) {
    Swal.fire({
        title: 'Advertencia',
        icon: 'warning',
        text: "¿Seguro deseas eliminar el empleado?",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar'
    }).then((result) => {
        if(result.isConfirmed){
            Swal.fire({
                title: "Eliminado!",
                text: "El registro a sido eliminado.",
                icon: "success"
            });
            fetch(`http://192.168.1.117:3000/api/empleado/${id}`, {
                method: 'DELETE',
            }).then(() => {
                tabla.forceRender();
            });
        }
    })
}

//AGREGAR NUEVO USUARIO===========================================================================
let btnNew = document.getElementById("newUser");
btnNew.addEventListener('click', function(){
    let tituloModal = document.querySelector(".titulo__modal")
    let contenedor = document.querySelector(".modal__container")
    let btnGuardarNuevo = document.getElementById("agregar")
    contenedor.classList.add('modal__show')
    tituloModal.innerText = "Agregar Nuevo Empleado"
    btnGuardarNuevo.style.display = 'block'
});

let btnGuardarEmpleado = document.querySelector(".guardar__modal")
btnGuardarEmpleado.addEventListener('click', function(){
    const dni = document.getElementById('dni').value;
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const nacimiento = document.getElementById('nacimiento').value;
    const celular = document.getElementById('celular').value;
    const correo = document.getElementById('correo').value;
    const cargo = document.getElementById('cargo').value;

    // Crear el objeto con los datos
    const data = {
        dni,
        nombres,
        apellidos,
        nacimiento,
        celular,
        correo,
        cargo,
    };

    // Enviar una solicitud POST a la API
    fetch(`http://192.168.1.117:3000/api/empleado`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => {
        if (response.ok) {
        // Mostrar un mensaje de éxito al usuario
        Swal.fire({
            title: "Buen trabajo!",
            text: "Nuevo Empleado Agregado",
            icon: "success"
        });
        // Cerrar el modal
        document.getElementById('myForm').reset();
        document.getElementById("agregar").style.display = "none"
        document.querySelector(".modal__container").classList.remove('modal__show')
        // Actualizar la tabla GridJS (opcional)
        tabla.forceRender();
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Agregue los datos correctamente",
            });
        }
  });
});

// CERRAR MODAL==================================================================================
let btnEquis = document.querySelector(".btn__equis")
btnEquis.addEventListener('click', function(){
    let contenedor = document.querySelector(".modal__container")
    document.getElementById('myForm').reset();
    contenedor.classList.remove('modal__show')
    document.getElementById("editar").style.display = "none"
    document.getElementById("agregar").style.display = "none"
})

// FUNCION QUE TRAE LOS DATOS Y LOS RELLENA EN EL MODAL=============================================
function editar(id) {
    let tituloModal = document.querySelector(".titulo__modal")
    let contenedor = document.querySelector(".modal__container")
    let btnGuardarEditado = document.getElementById("editar")
    contenedor.classList.add('modal__show')
    tituloModal.innerText = "Editar Empleado"
    btnGuardarEditado.style.display = 'block'

    fetch(`http://192.168.1.117:3000/api/empleado/${id}`)
        .then((response) => response.json())
        .then((data) => {
            
            document.getElementById('idEmpleado').value = data.id
            document.getElementById('dni').value = data.dni;
            document.getElementById('nombres').value = data.nombres;
            document.getElementById('apellidos').value = data.apellidos;
            const dateString = data.nacimiento;
            const date = dateString.substring(0, 10);
            document.getElementById('nacimiento').value = date;
            document.getElementById('celular').value = data.celular;
            document.getElementById('correo').value = data.correo;
            document.getElementById('cargo').value = data.cargo;
        })
}

//CON ESTA FUNCION SE GUARDAN LOS DATOS ACTUALIZADOS
let btnGuardarEditados = document.querySelector("#editar")
btnGuardarEditados.addEventListener('click', function () {
    // Obtener los valores de los campos del modal
    const id = document.getElementById('idEmpleado').value
    const dni = document.getElementById('dni').value;
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const nacimiento = document.getElementById('nacimiento').value;
    const celular = document.getElementById('celular').value;
    const correo = document.getElementById('correo').value;
    const cargo = document.getElementById('cargo').value;
    let contenedor = document.querySelector(".modal__container")
  
    // Crear el objeto con los datos actualizados
    const data = {
        dni,
        nombres,
        apellidos,
        nacimiento,
        celular,
        correo,
        cargo,
    };
  
    // Enviar una solicitud PUT a la API
    fetch(`http://192.168.1.117:3000/api/empleado/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
      .then((response) => {
            if (response.ok) {
            // Mostrar un mensaje de éxito al usuario
            Swal.fire({
                title: "Buen trabajo!",
                text: "Empleado actualizado",
                icon: "success"
            });
            // Cerrar el modal
            document.getElementById('myForm').reset();
            document.getElementById("editar").style.display = "none"
            contenedor.classList.remove('modal__show')
            // Actualizar la tabla GridJS (opcional)
            tabla.forceRender();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Agregue los datos correctamente",
                });
            }
      });
  })