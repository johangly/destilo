import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request) {
	try {
		const body = await request.json();
		const {
			cliente,
			cedula,
			teléfono,
			email,
			direccion,
      
			nrocasa,
			ciudad,
			provincia,
			pais,
			empresa,
			rif, // Se extrae rif desde el body
		} = body;

		// Validación de campos obligatorios
		if (!cliente || !cedula || !teléfono || !email || !direccion) {
			return new Response(
				JSON.stringify({
					error: 'Todos los campos obligatorios deben estar completos.',
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Referencia a la colección en Firestore
		const collectionRef = collection(db, 'clientes');
		const docRef = await addDoc(collectionRef, {
			cliente,
			cedula,
			teléfono,
			email,
			direccion,
			nrocasa: nrocasa || '',
			ciudad: ciudad || '',
			provincia: provincia || '',
			pais: pais || '',
			empresa: empresa || 'Sin empresa',
			rif: rif || '', // Ahora toma el valor enviado en el body
			fechaRegistro: new Date().toISOString(),
		});

		return new Response(
			JSON.stringify({ message: 'Cliente agregado con éxito.', id: docRef.id }),
			{ status: 201, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		console.error('Error al agregar cliente:', error);
		return new Response(
			JSON.stringify({ error: 'Error al agregar el cliente.' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
