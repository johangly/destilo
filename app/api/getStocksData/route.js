// /api/getStocksData/route.js
import { api } from '@/lib/apiClient';

export async function GET(req) {
	try {
		
		const userRole = req.headers.get('X-User-Role');
		if (!userRole) {
			return new Response(
				JSON.stringify({ error: 'Rol no proporcionado o formato inválido' }),
				{
					status: 401,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
	
		// Obtener todos los stocks usando la nueva API
		const stocks = await api.getStocks(userRole);

		// Verificar si se obtuvieron los stocks correctamente
		if (!stocks) {
			return new Response(
				JSON.stringify({ error: 'No se pudieron obtener los datos del inventario' }),
				{
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		return new Response(JSON.stringify(stocks), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error obteniendo datos:', error);
		return new Response(JSON.stringify({ error: 'Error al obtener datos' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}