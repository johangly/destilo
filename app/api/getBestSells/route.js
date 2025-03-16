import { api } from '@/lib/apiClient';

export async function GET(request) {
    try {
        const userRole = request.headers.get('X-User-Role');
        if (!userRole) {
            return new Response(
                JSON.stringify({ error: 'No autorizado' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        const { datos } = await api.getBestSells(userRole);
        return new Response(
            JSON.stringify({ datos }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        return new Response(
            JSON.stringify({ error: 'Error interno del servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
