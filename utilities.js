// utilities.js hace que los datos ingresados se normalicen segun del tipo de dato.

const utilities = {
    // 1. Normalización de Cadenas (Indicaciones del diagrama)
    normalizarTexto: (texto) => (texto ? texto.trim() : ""),

    // Para Títulos: "  hola mundo  " -> "HOLA MUNDO"
    capitalizarTitulo: (titulo) => utilities.normalizarTexto(titulo).toUpperCase(),

    // Para Emails y Búsquedas: "JUAN@GMAIL.COM" -> "juan@gmail.com"
    normalizarEmail: (email) => utilities.normalizarTexto(email).toLowerCase(),

    // 2. Normalización de Números (Seguridad para IDs y DNI)
    // Asegura que el DNI sea siempre un número entero positivo
    normalizarDNI: (dni) => {
        const num = parseInt(dni);
        return isNaN(num) ? null : Math.abs(num);
    },

    // 3. Manejo de Archivos Centralizado (Arquitectura del proyecto)
    // Evita repetir fs.readFileSync en cada servicio
    leerJSON: (path) => {
        try {
            const fs = require("fs");
            return JSON.parse(fs.readFileSync(path, "utf-8"));
        } catch (err) {
            return []; // Retorna array vacío si hay error o el archivo no existe
        }
    },

    escribirJSON: (path, datos) => {
        const fs = require("fs");
        fs.writeFileSync(path, JSON.stringify(datos, null, 2));
    }
};

module.exports = utilities;