import { api } from '@/lib/apiClient';

export async function DELETE(request) {
    try {
        const body = await request.json();
        const { id } = body;
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
        // Validacion del id
        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Id no proporcionado' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Eliminar usando la nueva API
        await api.deleteData(userRole,id);

        return new Response(
            JSON.stringify({ 
                message: `Documento ${id} eliminado`
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error eliminando documento:', error);
        return new Response(
            JSON.stringify({ error: 'Error al eliminar el documento' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}