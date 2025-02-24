import { api } from '@/lib/apiClient';

export async function POST(request) {
    try {
        const body = await request.json();
        const result = await api.createData(body);
        return new Response(
            JSON.stringify({
                id: result.id,
                message: 'Datos agregados exitosamente',
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error al agregar los datos:', error);
        return new Response(
            JSON.stringify({ error: 'Error al agregar los datos' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}