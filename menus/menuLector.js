//Prompt para la interaccion del usuario.
const prompt = require("prompt-sync")();
const usuariosService = require("../services/usuariosService");

//Menu para el lector. 
function menuLector() {
    console.log("\n📖 ACCESO LECTOR");
    console.log("1. Ingresar (Ya estoy registrado)");
    console.log("2. Registrarse (Nuevo usuario)");
    console.log("3. Volver");

    const inicio = prompt("Seleccione: ");
    //Condicional para el menu.
    if (inicio === "1") {
        const dni = parseInt(prompt("Ingrese su DNI: "));
        const usuarioValido = usuariosService.validarUsuario(dni);
        //Validación del usuario con el dni y personalización del saludo con su nombre.
        if (usuarioValido) {
            console.log(`\n✅ Bienvenido/a, ${usuarioValido.nombre}!`);
            mostrarOpcionesLector(dni); 
        } else {
            console.log("❌ Usuario no encontrado.");
        }
    } else if (inicio === "2") {
        const dni = parseInt(prompt("DNI: "));
        const nombre = prompt("Nombre: ");
        const email = prompt("Email: ");
        usuariosService.registrarUsuario({ dni, nombre, email });
    }
}

function mostrarOpcionesLector(dniLogueado) {
    let volver = false;
    while (!volver) {
        console.log("\n--- ACCIONES DISPONIBLES ---");
        console.log("1. Buscar Libros");
        console.log("2. Solicitar Préstamo");
        console.log("3. Devolver Libro");
        console.log("4. Cerrar Sesión");

        const opcion = prompt("Seleccione: ");
        switch (opcion) {
            case "1":
                menuBusqueda(dniLogueado);
                break;
            case "2":
                menuPrestamo(dniLogueado);
                break;
            case "3":
                const datosUsuario = usuariosService.validarUsuario(dniLogueado);
                if (datosUsuario.librosPrestados.length === 0) {
                    console.log("👉 No tienes libros pendientes.");
                } else {
                    console.table(datosUsuario.librosPrestados);
                    const entrada = prompt("Ingrese ID o Título para devolver: ");
                    console.log(usuariosService.informarDevolucion(dniLogueado, entrada));
                }
                break;
            case "4":
                volver = true;
                break;
        }
    }
}

// --- SUB-MENÚ DE BÚSQUEDA ---
function menuBusqueda(dni) {
    console.log("\n🔍 BUSCAR POR:");
    console.log("a. Palabra Clave (Título)");
    console.log("b. Género");
    console.log("c. Autor");
    
    const tipo = prompt("Seleccione: ").toLowerCase();
    const query = prompt("Ingrese el texto a buscar: ");
    
    const resultados = usuariosService.buscarLibros(query); // El servicio ya filtra por los 3 campos

    if (resultados.length > 0) {
        console.table(resultados.map(l => ({
            ID: l.id, Título: l.titulo, Autor: l.autor, Género: l.genero, Estado: l.disponible ? "🟢 OK" : "🔴 Prestado"
        })));

        console.log("\n¿Qué desea hacer?");
        console.log("1. Solicitar préstamo de un resultado");
        console.log("2. Realizar otra búsqueda");
        console.log("3. Regresar al menú");

        const accion = prompt(">> ");
        if (accion === "1") menuPrestamo(dni);
        else if (accion === "2") menuBusqueda(dni);
    } else {
        console.log("❌ No se encontraron coincidencias.");
    }
}

// --- SUB-MENÚ DE PRÉSTAMO ---
function menuPrestamo(dni) {
    console.log("\n📚 SOLICITAR PRÉSTAMO");
    console.log("a. Ingresar ID del libro");
    console.log("b. Buscar libro para obtener ID");

    const modo = prompt("Seleccione: ").toLowerCase();
    
    if (modo === "b") {
        const q = prompt("Nombre/Autor del libro: ");
        const encontrados = usuariosService.buscarLibros(q);
        console.table(encontrados);
    }

    const id = parseInt(prompt("Ingrese el ID del libro a llevar: "));
    console.log(usuariosService.solicitarPrestamo(dni, id)); // Genera la fecha automáticamente
}

module.exports = menuLector;