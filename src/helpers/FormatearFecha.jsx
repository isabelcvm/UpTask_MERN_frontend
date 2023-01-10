export const formatearFecha = fecha => {

    const nuevoFecha = new Date(fecha.split('T')[0].split('-'))
    const opciones = {
        weekday:'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return nuevoFecha.toLocaleDateString('es-ES', opciones)
}