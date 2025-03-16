import { NextResponse } from 'next/server';
import { api } from '@/lib/apiClient';

export async function GET(request) {
    try {
        const userRole = request.headers.get('X-User-Role');
        if (!userRole) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }
        const { datos } = await api.getBestServices(userRole);
        return NextResponse.json({ datos }, { status: 200 });
    } catch (error) {
        console.error('Error al obtener servicios más vendidos:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
