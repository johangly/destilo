import { api } from '@/lib/apiClient';

export async function POST(request) {
    try {

        const body = await request.json();
        const { email } = body;

        if (!email) {
            return new Response(
                JSON.stringify({ message: 'Email no proporcionado' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        try {
            await api.requestResetPassword(email);
        } catch (error) {
            console.error('Error al enviar el correo de recuperación:', error);
            return new Response(
                JSON.stringify({ message: 'Error al enviar el correo de recuperación' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ message: 'Correo de recuperación enviado.' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return new Response(
            JSON.stringify({ message: 'Error al enviar el correo de recuperación' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}