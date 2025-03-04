import { api } from '@/lib/apiClient';

export async function GET(request) {
	try {
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
		// Obtener todos los servicios usando la nueva API
		const usuarios = await api.getUsers(userRole);

		
		// Verificar si se obtuvieron los usuarios correctamente
		if (!usuarios) {
			return new Response(
				JSON.stringify({ error: 'No se pudieron obtener los usuarios' }),
				{
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		return new Response(JSON.stringify(usuarios), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error al obtener los usuarios:', error);
		return new Response(
			JSON.stringify({ error: 'Error al obtener los usuarios' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}