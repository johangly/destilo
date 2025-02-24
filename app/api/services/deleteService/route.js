// /api/deleteData/route.js
import { api } from '@/lib/apiClient';

export async function DELETE(request) {
	try {
		const body = await request.json();
		const { id } = body;

		if (!id) {
			return new Response(JSON.stringify({ error: 'ID no proporcionado' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Eliminar el servicio usando la nueva API
		await api.deleteService(id);

		return new Response(
			JSON.stringify({
				message: `Servicio con ID ${id} eliminado correctamente.`,
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error eliminando servicio:', error);
		return new Response(
			JSON.stringify({ error: 'Error al eliminar el servicio' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
