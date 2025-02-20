import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET(request) {
	try {
		const collectionRef = collection(db, 'services');
		const snapshot = await getDocs(collectionRef);
		const ventas = snapshot.docs.map((doc) => ({
			id: doc.id, // Incluye el ID del documento
			...doc.data(), // Incluye los datos del documento
		}));

		return new Response(JSON.stringify(ventas), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error al obtener las ventas:', error);
		return new Response(
			JSON.stringify({ error: 'Error al obtener las ventas' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
