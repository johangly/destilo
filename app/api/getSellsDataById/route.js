import { api } from '@/lib/apiClient';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
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
	
	if (!id) {
		return new Response(
			JSON.stringify({ error: 'El ID de la factura es inválido' }),
			{
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	try {
		// Obtener todas las ventas usando la nueva API
		const ventas = await api.getSellsById(userRole,id);
		// Verificar si se obtuvieron las ventas correctamente
		if (!ventas) {
			return new Response(
				JSON.stringify({ error: 'No se pudieron obtener las ventas' }),
				{
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
		console.log('nueva venta by id:',ventas)
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