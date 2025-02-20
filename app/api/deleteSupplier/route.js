import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(request) {
	try {
		const { id } = await request.json();

		if (!id) {
			return new Response(
				JSON.stringify({ error: 'El ID del proveedor es obligatorio' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		await deleteDoc(doc(db, 'proveedores', id));

		return new Response(
			JSON.stringify({ message: 'Proveedor eliminado con éxito' }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error al eliminar el proveedor:', error);
		return new Response(
			JSON.stringify({ error: 'Error al eliminar el proveedor' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
