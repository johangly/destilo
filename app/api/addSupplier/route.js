import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request) {
	try {
		const body = await request.json();
		const {
			nombre,
			razonSocial,
			rif,
			telefono,
			email,
			direccion,
			productos,
			servicios,
			cargo,
			webrrss,
		} = body;

		// Validación de campos obligatorios
		if (
			!nombre ||
			!razonSocial ||
			!rif ||
			!telefono ||
			!email ||
			!direccion?.calle ||
			!direccion?.numero ||
			!direccion?.ciudad ||
			!direccion?.estado ||
			!direccion?.pais ||
			!productos ||
			!servicios ||
			!cargo ||
			!webrrss
		) {
			return new Response(
				JSON.stringify({ error: 'Todos los campos son obligatorios' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Crear la estructura de datos para Firebase
		const proveedorData = {
			nombre,
			razonSocial,
			rif,
			telefono,
			email,
			direccion: {
				calle: direccion.calle,
				numero: direccion.numero,
				ciudad: direccion.ciudad,
				estado: direccion.estado,
				pais: direccion.pais,
			},
			productos,
			servicios,
			cargo,
			webrrss,
			fechaRegistro: new Date().toISOString(),
		};

		const docRef = await addDoc(collection(db, 'proveedores'), proveedorData);

		return new Response(
			JSON.stringify({
				message: 'Proveedor agregado con éxito',
				id: docRef.id,
			}),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error al agregar el proveedor:', error);
		return new Response(
			JSON.stringify({ error: 'Error al agregar el proveedor' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
