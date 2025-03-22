import { api } from '@/lib/apiClient';

export async function GET(request) {
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

	try {
		// Obtener todas las ventas usando la nueva API
		const ventas = await api.getSells(userRole);
		// Verificar si se obtuvieron las ventas correctamente
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