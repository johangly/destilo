import { NextResponse } from 'next/server';
import { api } from '@/lib/apiClient';

export async function GET(request) {
    try {
        const userRole = request.headers.get('X-User-Role');
        if (!userRole) {
            return new Response(
                JSON.stringify({ error: 'No autorizado' }),
                { status: 401 }
            );
        }
        const data = await api.getBestServices(userRole);
        return new Response(
            JSON.stringify(data),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al obtener servicios más vendidos:', error);
        return new Response(
            JSON.stringify({ error: 'Error interno del servidor' }),
            { status: 500 }
        );
    }
}
