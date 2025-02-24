import { api } from '@/lib/apiClient';

export async function POST(request) {
    try {
        const body = await request.json();
        const result = await api.createSell(body);

        return new Response(
            JSON.stringify({
                id: result.id,
                message: 'Venta registrada exitosamente',
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        return new Response(
            JSON.stringify({ error: 'Error al registrar la venta' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}