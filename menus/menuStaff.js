// menus/menuStaff.js
const prompt = require("prompt-sync")();

// Importamos desde la carpeta 'utilities' (subimos un nivel con ../) Genere una carpeta utilities para normalizar los datos. 
const { leerJSON, capitalizarTitulo } = require("../utilities");
const librosService = require("../services/librosService");
const usuariosService = require("../services/usuariosService");

//Utilizo while para que el usuario pueda seleccionar las opciones del menu.
//la elección se guarda en opción y da inicio a los arrays. Cada caso un objeto.
function menuStaff() {
    let volverPrincipal = false;
    while (!volverPrincipal) {
        console.log("\n👨‍💼 PANEL DE CONTROL - STAFF");
        console.log("1. Registrar nuevo libro");
        console.log("2. Reportes y Estadísticas");
        console.log("3. Listado de libros prestados y quién los tiene");
        console.log("4. Buscar Libros");
        console.log("5. Listado total de libros");
        console.log("6. Menú Principal");

        const opcion = prompt(">> ");
        switch (opcion) {
            case "1":
                const nuevoLibro = {
                    titulo: prompt("Título: "),
                    autor: prompt("Autor: "),
                    año: prompt("Año publicación: "),
                    genero: prompt("Género: ")
                };
                librosService.agregarLibro(nuevoLibro);
                console.log("✅ Libro", nuevoLibro.nombre, "guardado exitosamente.");
                break;
            case "2":
                mostrarSubMenuReportes();
                break;
            case "3":
                // Llamada corregida a la función definida abajo
                mostrarLibrosPrestadoAUsuario();
                break;
            case "4":
                menuBusquedaStaff();
                break;
            case "5":
                listarInventarioTotal();
                break;
            case "6":
                volverPrincipal = true;
                break;
            default:
                console.log("⚠️ Opción no válida.");
        }
    }
}

// --- FUNCIÓN PARA EL LISTADO DE PRÉSTAMOS (OPCIÓN 3) ---
function mostrarLibrosPrestadoAUsuario() {
    // Usamos la utilidad para leer el JSON de usuarios
    const usuarios = leerJSON("./usuarios.json");
    const listaReporte = [];

    usuarios.forEach(usuario => {
        // Verificamos que librosPrestados sea un array y no un string simple
        if (Array.isArray(usuario.librosPrestados)) {
            usuario.librosPrestados.forEach(prestamo => {
                listaReporte.push({
                    Lector: usuario.nombre,
                    DNI: usuario.dni,
                    Libro: prestamo.titulo,
                    "Fecha Salida": prestamo.fechaPrestamo || "Sin fecha"
                });
            });
        }
    });

    if (listaReporte.length > 0) {
        console.log("\n📋 LIBROS ACTUALMENTE EN PRESTAMOS A LOS LECTORES:");
        console.table(listaReporte);//table muestra la información como una tabla, :)
        
        // --- TOTALIZADOR AGREGADO --- Me suguirió el chat GP usar colores para resaltar esta información. 
        const azul = "\x1b[36m";
        const reset = "\x1b[0m";
        console.log(`${azul}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(` 📊 TOTAL DE LIBROS PRESTADOS: ${listaReporte.length}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${reset}\n`);
    } else {
        console.log("\n📭 No hay libros prestados en este momento.");
    }
}

// --- SUB-MENÚ DE REPORTES (OPCIÓN 2) ---
function mostrarSubMenuReportes() {
    let volver = false;
    while (!volver) {
        console.log("\n📊 SELECCIONE UN REPORTE:");
        console.log("a. Préstamos prolongados (Vencidos)");
        console.log("e. Cálculos Estadísticos (Años)");
        console.log("f. Regresar al Menú Staff");

        const sub = prompt(">> ").toLowerCase().trim().charAt(0);
        
        switch (sub) {
            case "f":
                volver = true;
                break;

            case "a":
                // 1. Limpiamos cualquier rastro visual anterior
                const dias = parseInt(prompt("Ver préstamos de más de cuántos días?: "));
                const vencidos = librosService.reporteLibrosVencidos(dias);
                
                console.log(`\n📋 REPORTE DE PRÉSTAMOS (> ${dias} DÍAS):`);
                if (vencidos.length > 0) {
                    console.table(vencidos);
                } else {
                    console.log("✅ No se encontraron préstamos vencidos por esa cantidad de días.");
                }
                // El break aquí es fundamental para no "caer" en el siguiente caso
                break;

            case "e":
                const stats = librosService.calcularEstadisticas();
                if (stats) {
                    console.log("\n📈 ESTADÍSTICAS CRONOLÓGICAS DEL INVENTARIO:");
                    console.log(`- Promedio años: ${stats.promedio}`);
                    console.log(`- Año más frecuente: ${stats.moda}`);
                    console.log(`- Más antiguo: ${stats.antiguo}`);
                    console.log(`- Más nuevo: ${stats.nuevo}`);
                    console.log(`- Brecha (Diferencia): ${stats.diferencia} años`);
                } else {
                    console.log("⚠️ No hay datos suficientes en el inventario.");
                }
                break;

            default:
                console.log("⚠️ Opción no válida en Reportes.");
                break;
        }
    }
}

// --- LISTADO TOTAL (OPCIÓN 5) ---
function listarInventarioTotal() {
    const libros = librosService.obtenerLibros();
    console.log("\n📚 INVENTARIO COMPLETO:");
    
    // Mostramos una tabla limpia con iconos de estado
    console.table(libros.map(l => ({
        ID: l.id || "S/N",
        Título: l.titulo || "Sin título",
        Autor: l.autor || "Anónimo",
        Estado: l.disponible ? "🟢 Disponible" : "🔴 Prestado"
    })));
}

// --- BÚSQUEDA (OPCIÓN 4) ---
function menuBusquedaStaff() {
    const query = prompt("Ingrese palabra clave para buscar: ");
    const resultados = usuariosService.buscarLibros(query);
    
    if (resultados.length > 0) {
        console.table(resultados.map(l => ({
            ID: l.id,
            Título: l.titulo,
            Autor: l.autor,
            Estado: l.disponible ? "🟢 Disponible" : "🔴 Prestado"
        })));
    } else {
        console.log("❌ No se encontraron resultados.");
    }
}

module.exports = menuStaff;