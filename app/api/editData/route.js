import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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

		const docRef = doc(db, 'stocks', id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return new Response(
				JSON.stringify({ error: 'El producto no existe en la base de datos' }),
				{ status: 404, headers: { 'Content-Type': 'application/json' } }
			);
		}

		await updateDoc(docRef, {
			producto,
			cantidad,
			precioUnitario,
			codigo,
			proveedor,
		});

		console.log('Producto actualizado con ID:', id);

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
