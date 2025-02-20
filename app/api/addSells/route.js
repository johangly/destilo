import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request) {
	try {
		const body = await request.json();

		// Crear un nuevo documento que contiene toda la lista de compras
		const collectionRef = collection(db, 'sells');
		const docRef = await addDoc(collectionRef, {
			fecha: new Date().toISOString(), // Fecha única para la lista
			id_factura: Math.floor(Math.random() * 100000000000), // ID de la factura
			productos: body.productos, // Lista de productos anidada
		});

		console.log('Lista de compras agregada con ID:', docRef.id);

		return new Response(
			JSON.stringify({
				message: 'Lista de compras agregada con éxito.',
				id: docRef.id,
			}),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error al procesar la solicitud:', error);
		return new Response(
			JSON.stringify({ error: 'Error al agregar la lista de compras' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
