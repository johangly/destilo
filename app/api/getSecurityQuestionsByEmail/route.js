import { api } from '@/lib/apiClient';

export async function GET(req) {
    try {
        const userEmail = req.headers.get('X-User-Email');
        console.log(userEmail,'userEmail')
        if (!userEmail) {
            return new Response(
                JSON.stringify({ error: 'Correo electrónico no proporcionado o formato inválido' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        
        const getSecurityQuestions = await api.getSecurityQuestionsByEmail(userEmail);
        return new Response(JSON.stringify(getSecurityQuestions), {
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