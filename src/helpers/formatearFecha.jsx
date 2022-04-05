export const formatearFecha = fecha => {
    const fechaNueva = new Date(fecha);
    const opciones = { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }

    return fechaNueva.toLocaleDateString('es-ES', opciones)
}