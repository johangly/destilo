import { api } from '@/lib/apiClient';

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, servicio, descripcion, precio } = body;

        // Validaciones originales
        if (!id || !servicio || !descripcion || !precio) {
            return new Response(
                JSON.stringify({ error: 'Todos los campos son obligatorios' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Actualizar servicio usando la nueva API
        const updatedService = await api.updateService(id, {
            servicio,
            descripcion,
            precio: parseFloat(precio)
        });

        return new Response(
            JSON.stringify({
                message: 'Servicio actualizado exitosamente',
                id: updatedService.id
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error actualizando servicio:', error);
        return new Response(
            JSON.stringify({ error: 'Error al actualizar el servicio' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}