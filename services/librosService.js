const { leerJSON, escribirJSON, capitalizarTitulo } = require("../utilities");
const pathLibros = "./libros.json";
const pathUsuarios = "./usuarios.json";

const librosService = {
    obtenerLibros: () => leerJSON(pathLibros),

    agregarLibro: (nuevoLibro) => {
        const libros = librosService.obtenerLibros();
        // Filtramos para obtener el ID más alto actual de forma segura
        const librosValidos = libros.filter(l => l.id != null);
        const maxId = librosValidos.length > 0 ? Math.max(...librosValidos.map(l => l.id)) : 0;

        const libroProcesado = {
            id: maxId + 1,
            titulo: capitalizarTitulo(nuevoLibro.titulo),
            autor: nuevoLibro.autor.trim(),
            año: Number(nuevoLibro.año) || null,
            genero: nuevoLibro.genero ? nuevoLibro.genero.trim() : "Sin Género",
            disponible: true
        };
        libros.push(libroProcesado);
        escribirJSON(pathLibros, libros);
    },
//Esto me parecio interesante para darle la posiblidad al staff de seguir algun prestamo de libro. 
    reporteLibrosVencidos: (diasLimite) => {
        const usuarios = leerJSON(pathUsuarios);
        const hoy = new Date();
        const reporte = [];
        usuarios.forEach(u => {
            u.librosPrestados.forEach(p => {
                const diff = Math.floor((hoy - new Date(p.fechaPrestamo)) / (1000 * 60 * 60 * 24));
                if (diff >= diasLimite) {
                    reporte.push({ Lector: u.nombre, Libro: p.titulo, Dias: diff });
                }
            });
        });
        return reporte;
    },

    calcularEstadisticas: () => {
        const libros = leerJSON(pathLibros);
        const listaAnios = libros
            .map(l => Number(l.año || l.anio))
            .filter(a => !isNaN(a) && a > 0);

        if (listaAnios.length === 0) return null;

        const suma = listaAnios.reduce((acc, val) => acc + val, 0);
        const promedio = Math.round(suma / listaAnios.length);

        const frecuencias = {};
        listaAnios.forEach(a => frecuencias[a] = (frecuencias[a] || 0) + 1);
        let maxFrec = 0, moda = listaAnios[0];
        for (const anio in frecuencias) {
            if (frecuencias[anio] > maxFrec) {
                maxFrec = frecuencias[anio];
                moda = anio;
            }
        }

        const nuevo = Math.max(...listaAnios);
        const antiguo = Math.min(...listaAnios);

        return { promedio, moda, nuevo, antiguo, diferencia: nuevo - antiguo };
    }
};

module.exports = librosService;