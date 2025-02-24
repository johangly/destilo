import { api } from '@/lib/apiClient';

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, producto, cantidad, precioUnitario, codigo, proveedor } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'ID de producto no proporcionado' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Verificar si el producto existe
        // const existingProduct = await api.getStock(id);
        // if (!existingProduct) {
        //     return new Response(
        //         JSON.stringify({ error: 'El producto no existe en la base de datos' }),
        //         { status: 404, headers: { 'Content-Type': 'application/json' } }
        //     );
        // }

        // Actualizar el producto
        try {
            await api.updateStockById(id, {
                producto,
                cantidad,
                precioUnitario,
                codigo,
                proveedor,
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