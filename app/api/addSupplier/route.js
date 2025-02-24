import { api } from '@/lib/apiClient';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            nombre,
            razonSocial,
            rif,
            email,
            telefono,
            cargo,
            productos,
            servicios,
            webrrss
        } = body;

        // Validación de campos obligatorios
        if (!nombre || !razonSocial || !rif) {
            return new Response(
                JSON.stringify({
                    error: 'Los campos nombre, razón social y RIF son obligatorios.',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const result = await api.createSupplier({
            nombre,
            razonSocial,
            rif,
            email: email || '',
            telefono: telefono || '',
            cargo: cargo || '',
            productos: productos || [],
            servicios: servicios || [],
            webrrss: webrrss || '',
            fechaRegistro: new Date().toISOString(),
        });

        return new Response(
            JSON.stringify({
                id: result.id,
                message: 'Proveedor agregado exitosamente',
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