// CODIGO PARA AGREGAR BORDE AL DIV
const inputs = document.querySelectorAll("input");

inputs.forEach(input => {
    const divContainer = input.closest(".input__style");

  input.addEventListener("focus", () => {
     divContainer.classList.add("active");
  });

  input.addEventListener("blur", () => {
     divContainer.classList.remove("active");
  });
});

// CODIGO PARA SELECCIONAR INPUT DE ACUERDO AL DIV
function seleccionarInput(inputId) {
    var inputElement = document.getElementById(inputId);
    inputElement.select();
}

//CODIGO PARA ANIMAR EL ICONO CUANDO EL MOUSE ENTRE EN EL DIV
function addTriggerAttribute(element) {
   // Agregar el atributo trigger="in" al icono cuando se pasa el ratón sobre .input__style
   const icon = element.querySelector('lord-icon');
   icon.setAttribute('trigger', 'in');
}