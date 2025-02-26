import { api } from '@/lib/apiClient';

export async function GET(request) {
    try {
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
        // Obtener todos los proveedores usando la nueva API
        const proveedores = await api.getSuppliers(userId);

        // Verificar si se obtuvieron los proveedores correctamente
        if (!proveedores) {
            return new Response(
                JSON.stringify({ error: 'No se pudieron obtener los proveedores' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        return new Response(JSON.stringify(proveedores), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error al obtener los proveedores:', error);
        return new Response(
            JSON.stringify({ error: 'Error al obtener los proveedores' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}