import { api } from '@/lib/apiClient';

export async function PUT(request) {
    try {

        const body = await request.json();
        const { token, newPassword } = body;
        if (!token || !newPassword) {
            return new Response(
                JSON.stringify({ message: 'Token y nueva contraseña son obligatorios' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        try {
            await api.resetPassword(token, newPassword);
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            return new Response(
                JSON.stringify({ message: 'Error al restablecer la contraseña' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ message: 'Contraseña restablecida con éxito.' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return new Response(
            JSON.stringify({ message: 'Error al restablecer la contraseña' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}