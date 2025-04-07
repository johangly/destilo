import { api } from '@/lib/apiClient';

export async function POST(req) {
    try {
      
        const body = await req.json();
        if(!body) {
            return new Response(
                JSON.stringify({ error: 'No se proporcionaron datos' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        const response = await api.validateSecurityQuestions(body);
        return new Response(
            JSON.stringify(response),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error al agregar los datos:', error);
        return new Response(
            JSON.stringify({ error: 'Error al agregar los datos' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}