// import { db } from '@/lib/firebase';
// import { doc, deleteDoc } from 'firebase/firestore';

// export async function DELETE(request) {
// 	try {
// 		const { id } = await request.json();

// 		if (!id) {
// 			return new Response(
// 				JSON.stringify({ error: 'El ID del cliente es obligatorio' }),
// 				{ status: 400, headers: { 'Content-Type': 'application/json' } }
// 			);
// 		}

// 		const docRef = doc(db, 'clientes', id);
// 		await deleteDoc(docRef);

// 		return new Response(
// 			JSON.stringify({ message: 'Cliente eliminado con éxito' }),
// 			{ status: 200, headers: { 'Content-Type': 'application/json' } }
// 		);
// 	} catch (error) {
// 		console.error('Error al eliminar el cliente:', error);
// 		return new Response(
// 			JSON.stringify({ error: 'Error al eliminar el cliente' }),
// 			{ status: 500, headers: { 'Content-Type': 'application/json' } }
// 		);
// 	}
// }

import { api } from '@/lib/apiClient';

export async function DELETE(request) {
    try {
        const userId = request.headers.get('X-User-Id');
        if (!userId) {
           return new Response(
               JSON.stringify({ error: 'UID no proporcionado o formato inválido' }),
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
        
        await api.deleteCustomer(userId,id);

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