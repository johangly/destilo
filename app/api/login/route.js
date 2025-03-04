import { api } from '@/lib/apiClient';

export async function POST(request) {
    try {

        const body = await request.json();
        const {
           username,
           password,
        } = body;

        // Validación de campos obligatorios
        if (!username || !password) {
            return new Response(
                JSON.stringify({
                    error: 'Faltan por llenar campos obligatorios (nombre de usuario, contraseña).',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const result = await api.login({
            username,
            password,
        });

        console.log(result)
        return new Response(
            JSON.stringify(result),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error al iniciar sesion:', error);
        return new Response(
            JSON.stringify({ error: 'Error al iniciar sesion' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}