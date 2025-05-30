import { api } from '@/lib/apiClient';

export async function DELETE(request) {
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
		const { id } = await request.json();

		if (!id) {
			return new Response(
				JSON.stringify({ error: 'El ID del proveedor es obligatorio' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Eliminar el proveedor
		await api.deleteSupplier(userRole,id);

		return new Response(
			JSON.stringify({ message: 'Proveedor eliminado con éxito' }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error al eliminar el proveedor:', error);
		return new Response(
			JSON.stringify({ error: 'Error al eliminar el proveedor' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}