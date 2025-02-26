import { api } from '@/lib/apiClient';

export async function POST(req) {
    try {
        const userId = req.headers.get('X-User-Id');
		if (!userId) {
			return new Response(
				JSON.stringify({ error: 'UID no proporcionado o formato inválido' }),
				{
					status: 401,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

        const body = await req.json();
        const result = await api.createSell(userId,body);

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