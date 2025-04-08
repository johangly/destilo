import { api } from '@/lib/apiClient';

export async function POST(request) {
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
        const body = await request.json();
        const {
            username,
            email,
            password,
            role,
            requireEmailValidation
        } = body;

        // Validación de campos obligatorios
        if (!username || !email || !password || !role) {
            return new Response(
                JSON.stringify({
                    error: 'Faltan campos obligatorios (nombre de usuario, correo electrónico, contraseña, rol).',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const result = await api.createUser(userRole,{
            username,
            email,
            password,
            role,
            requireEmailValidation
        });

        return new Response(
            JSON.stringify({
                id: result.id,
                ...result
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error al agregar el usuario:', error);
        return new Response(
            JSON.stringify({ error: 'Error al agregar el usuario' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}