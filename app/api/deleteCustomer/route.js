import { api } from '@/lib/apiClient';

export async function DELETE(request) {
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
        const { id } = body;

        // Validaciones originales
        if (!id) {
            return new Response(
                JSON.stringify({ error: 'ID de cliente no proporcionado' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        await api.deleteCustomer(userRole,id);

        return new Response(
            JSON.stringify({ 
                message: `Cliente ${id} eliminado exitosamente`,
                deletedId: id
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error eliminando cliente:', error);
        return new Response(
            JSON.stringify({ error: 'Error al eliminar el cliente' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}