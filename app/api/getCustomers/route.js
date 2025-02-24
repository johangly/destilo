import { api } from '@/lib/apiClient';

export async function GET(request) {
    try {
        const ventas = await api.getCustomers();
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