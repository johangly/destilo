// // /api/deleteData/route.js
// import { db } from '@/lib/firebase';
// import { doc, deleteDoc } from 'firebase/firestore';

// export async function DELETE(request) {
// 	try {
// 		const body = await request.json();
// 		const { id } = body;

// 		if (!id) {
// 			return new Response(JSON.stringify({ error: 'ID no proporcionado' }), {
// 				status: 400,
// 				headers: { 'Content-Type': 'application/json' },
// 			});
// 		}

// 		// Referencia al documento específico en Firestore
// 		const documentRef = doc(db, 'stocks', id);

// 		// Eliminar el documento de Firestore
// 		await deleteDoc(documentRef);

// 		return new Response(
// 			JSON.stringify({
// 				message: `Producto con ID ${id} eliminado correctamente.`,
// 			}),
// 			{
// 				status: 200,
// 				headers: { 'Content-Type': 'application/json' },
// 			}
// 		);
// 	} catch (error) {
// 		console.error('Error eliminando documento de Firestore:', error);
// 		return new Response(
// 			JSON.stringify({ error: 'Error al eliminar el documento' }),
// 			{
// 				status: 500,
// 				headers: { 'Content-Type': 'application/json' },
// 			}
// 		);
// 	}
// }

import { api } from '@/lib/apiClient';

export async function DELETE(request) {
    try {
        const body = await request.json();
        const { id } = body;
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
        // Validacion del id
        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Id no proporcionado' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Eliminar usando la nueva API
        await api.deleteData(userId,id);

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