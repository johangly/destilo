import { api } from '@/lib/apiClient';

export async function GET(request) {
    try {
        const userToken = request.headers.get('X-User-Token');
        if (!userToken) {
            return new Response(
                JSON.stringify({ error: 'Token no proporcionado o formato inválido' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const validateToken = await api.checkValidateToken(userToken);
        return new Response(JSON.stringify(validateToken), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return new Response(
            JSON.stringify({ error: 'Error al verificar el token' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}