import { api } from '@/lib/apiClient';

export async function GET(request) {
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
        const ventas = await api.getCustomers(userRole);
        return new Response(JSON.stringify(ventas), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        return new Response(
            JSON.stringify({ error: 'Error al obtener las ventas' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}