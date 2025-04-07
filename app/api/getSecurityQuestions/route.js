import { api } from '@/lib/apiClient';

export async function GET(req) {
    try {
        const userRole = req.headers.get('X-User-Role');
        const userId = req.headers.get('X-User-Id');
        
		if (!userRole) {
			return new Response(
				JSON.stringify({ error: 'Rol no proporcionado o formato inválido' }),
				{
					status: 401,
					headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        
        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'ID de usuario no proporcionado o formato inválido' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const securityQuestions = await api.getSecurityQuestions(userRole, userId);
        return new Response(JSON.stringify(securityQuestions), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error al verificar el token:', error);
        return new Response(
            JSON.stringify({ error: error }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}