import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(request) {
	try {
		const { id } = await request.json();

		if (!id) {
			return new Response(
				JSON.stringify({ error: 'El ID del cliente es obligatorio' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const docRef = doc(db, 'clientes', id);
		await deleteDoc(docRef);

		return new Response(
			JSON.stringify({ message: 'Cliente eliminado con éxito' }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		console.error('Error al eliminar el cliente:', error);
		return new Response(
			JSON.stringify({ error: 'Error al eliminar el cliente' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
