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
        const { id, producto, cantidad, precioUnitario, codigo, proveedor_id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'ID de producto no proporcionado' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Actualizar el producto
        try {
            await api.updateStockById(userRole,id, {
                producto,
                cantidad,
                precioUnitario,
                codigo,
                proveedor_id,
            });
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return new Response(
                JSON.stringify({ error: 'Error al actualizar el producto' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ message: 'Producto actualizado con éxito.' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return new Response(
            JSON.stringify({ error: 'Error al actualizar el producto' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}