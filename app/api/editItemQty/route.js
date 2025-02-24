import { api } from '@/lib/apiClient';

export async function PUT(request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();
        const { quantity } = await request.json();

        // Validación de cantidad
        if (quantity === undefined || quantity < 0) {
            return new Response(
                JSON.stringify({
                    error: 'La cantidad debe ser un número válido y no puede ser negativa.',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const result = await api.updateStockQuantity(id, quantity);

        return new Response(
            JSON.stringify({
                message: 'Cantidad actualizada exitosamente',
                id: result.id,
                quantity: quantity
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error al actualizar la cantidad:', error);
        return new Response(
            JSON.stringify({ error: 'Error al actualizar la cantidad' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}