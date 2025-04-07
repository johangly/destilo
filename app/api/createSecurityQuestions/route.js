import { api } from '@/lib/apiClient';

export async function POST(req) {
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
        const body = await req.json();
        if (!body.questions || !Array.isArray(body.questions) || body.questions.length < 1) {
            return new Response(
                JSON.stringify({ error: 'Debes proporcionar al menos 1 preguntas de seguridad' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const createSecurityQuestions = await api.createSecurityQuestions(userRole, body);
        return new Response(JSON.stringify(createSecurityQuestions), {
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