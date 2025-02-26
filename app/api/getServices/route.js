import { api } from '@/lib/apiClient';

export async function GET(request) {
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
		// Obtener todos los servicios usando la nueva API
		const servicios = await api.getServices(userId);

		
		// Verificar si se obtuvieron los servicios correctamente
		if (!servicios) {
			return new Response(
				JSON.stringify({ error: 'No se pudieron obtener los servicios' }),
				{
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		return new Response(JSON.stringify(servicios), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error al obtener los servicios:', error);
		return new Response(
			JSON.stringify({ error: 'Error al obtener los servicios' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}