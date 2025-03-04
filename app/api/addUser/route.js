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
            password,
            role    
        } = body;

        // Validación de campos obligatorios
        if (!username || !password || !role) {
            return new Response(
                JSON.stringify({
                    error: 'Faltan campos obligatorios (nombre de usuario, contraseña, rol).',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const result = await api.createUser(userRole,{
            username,
            password,
            role
        });

        return new Response(
            JSON.stringify({
                id: result.id,
                message: 'Usuario agregado exitosamente',
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