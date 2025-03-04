import { api } from '@/lib/apiClient';

export async function PUT(request) {
    try {
        const userRole = request.headers.get('X-User-Role');
        if (!userRole) {
            return new Response(
                JSON.stringify({ error: 'Rol no proporcionado o formato inválido' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

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
        const updatedService = await api.updateService(userRole,id, {
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