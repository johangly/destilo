import { api } from '@/lib/apiClient';

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
            rif,
        } = body;

        // Validación de campos obligatorios
        if (!cedula || !ciudad || !cliente || !direccion || !pais || !provincia) {
            return new Response(
                JSON.stringify({
                    error: 'Faltan por llenar campos obligatorios (cedula, ciudad, nombre del cliente, direccion, pais, provincia).',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        console.log('body', body)
        const result = await api.createCustomer({
            ...body,
            fechaRegistro: new Date().toISOString(),
        });

        return new Response(
            JSON.stringify({
                id: result.id,
                message: 'Cliente agregado exitosamente',
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error al agregar el cliente:', error);
        return new Response(
            JSON.stringify({ error: 'Error al agregar el cliente' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}