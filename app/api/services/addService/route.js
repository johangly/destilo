import { api } from '@/lib/apiClient';

export async function POST(request) {
    try {
        const body = await request.json();
        const { servicio, descripcion, precio } = body;
        const userId = request.headers.get('X-User-Id');
        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'UID no proporcionado o formato inválido' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        // Validación de campos obligatorios
        if (!servicio || !descripcion || !precio) {
            return new Response(
                JSON.stringify({ error: 'Todos los campos son obligatorios.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Crear el servicio usando la nueva API
        const result = await api.createService(userId,{
            servicio,
            descripcion,
            precio: parseFloat(precio),
        });

        return new Response(
            JSON.stringify({
                message: 'Servicio agregado con éxito.',
                id: result.id,
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error al agregar servicio:', error);
        return new Response(
            JSON.stringify({ error: 'Error al agregar el servicio.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
