const { leerJSON, escribirJSON, capitalizarTitulo, normalizarEmail, normalizarDNI } = require("../utilities");
const pathLibros = "./libros.json";
const pathUsuarios = "./usuarios.json";

const usuariosService = {
    validarUsuario: (dni) => {
        const usuarios = leerJSON(pathUsuarios);
        return usuarios.find(u => u.dni === normalizarDNI(dni));
    },

    registrarUsuario: (nuevoUsuario) => {
        const usuarios = leerJSON(pathUsuarios);
        const usuarioLimpio = {
            dni: normalizarDNI(nuevoUsuario.dni),
            nombre: capitalizarTitulo(nuevoUsuario.nombre),
            email: normalizarEmail(nuevoUsuario.email),
            librosPrestados: [] 
        };
        usuarios.push(usuarioLimpio);
        escribirJSON(pathUsuarios, usuarios);
        console.log(`\n✨ ¡Felicitaciones ${usuarioLimpio.nombre}! ✅ Usuario registrado con éxito.`);
    },

    buscarLibros: (criterio) => {
        const libros = leerJSON(pathLibros);
        const busqueda = normalizarEmail(criterio); // 
        return libros.filter(l => 
            (l.titulo || "").toLowerCase().includes(busqueda) || 
            (l.autor || "").toLowerCase().includes(busqueda) || 
            (l.genero || "").toLowerCase().includes(busqueda)
        );
    },

    solicitarPrestamo: (dni, libroId) => {
        const usuarios = leerJSON(pathUsuarios);
        const libros = leerJSON(pathLibros);
        const uIdx = usuarios.findIndex(u => u.dni === normalizarDNI(dni));
        const lIdx = libros.findIndex(l => l.id === libroId);

        if (uIdx !== -1 && lIdx !== -1 && libros[lIdx].disponible) {
            const fechaHoy = new Date().toISOString().split('T')[0];
            libros[lIdx].disponible = false;
            usuarios[uIdx].librosPrestados.push({
                idLibro: libros[lIdx].id,
                titulo: libros[lIdx].titulo,
                fechaPrestamo: fechaHoy
            });
            escribirJSON(pathUsuarios, usuarios);
            escribirJSON(pathLibros, libros);
            return `✅ Préstamo realizado el ${fechaHoy}.`;
        }
        return "❌ Error: Libro no disponible o usuario no registrado.";
    },

    informarDevolucion: (dni, entrada) => {
        const usuarios = leerJSON(pathUsuarios);
        const libros = leerJSON(pathLibros);
        const usuario = usuarios.find(u => u.dni === normalizarDNI(dni));
        if (!usuario) return "❌ Usuario no encontrado.";

        const query = entrada.toLowerCase().trim();
        const prestamo = usuario.librosPrestados.find(p => 
            p.idLibro.toString() === query || p.titulo.toLowerCase().includes(query)
        );

        if (prestamo) {
            usuario.librosPrestados = usuario.librosPrestados.filter(p => p !== prestamo);
            const libroInv = libros.find(l => l.id === prestamo.idLibro);
            if (libroInv) libroInv.disponible = true;
            escribirJSON(pathUsuarios, usuarios);
            escribirJSON(pathLibros, libros);
            return `✅ Devolución exitosa: "${prestamo.titulo}" está disponible de nuevo.`;
        }
        return "❌ No se encontró ese préstamo activo.";
    }
};

module.exports = usuariosService;