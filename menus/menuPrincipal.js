// menus/menuPrincipal.js 
// Cree un menú de inicio para dar la Bienvenida

const prompt = require("prompt-sync")();
const mostrarMenuStaff = require("./menuStaff"); 
const mostrarMenuLector = require("./menuLector");

//Mediante el while el usuario activa las opciones a los diferentes roles de usuario. 
function menuPrincipal() {
let salir = false;
while (!salir) {
    console.log("\n📚 Bienvenido/a la Biblioteca JS");
    console.log("1. Staff");
    console.log("2. Lector");
    console.log("3. Salir");

    const opcion = prompt("Seleccione una opción: ");
    switch (opcion) {
    case "1": mostrarMenuStaff(); break;
    case "2": mostrarMenuLector(); break;
    case "3": salir = true;
    // Mensaje de despedida del sistema
    console.log("Gracias por usar el Sistema de Bibliotecas JS, te esperamos proximamente");
    break;
    default: console.log("⚠️ Opción no válida.");
    }
}
}
module.exports = menuPrincipal;