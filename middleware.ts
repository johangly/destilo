import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const token = req.cookies.get('token')?.value;

	// 🔥 Rutas públicas
	const publicRoutes = ['/', '/reset-password', '/about', '/contact'];

	// Excluir archivos estáticos (CSS, JS, imágenes, fuentes, etc.)
	const isStaticAsset =
		req.nextUrl.pathname.startsWith('/_next') ||
		req.nextUrl.pathname.startsWith('/favicon.ico') ||
		req.nextUrl.pathname.startsWith('/public') ||
		req.nextUrl.pathname.startsWith('/api');

	if (isStaticAsset) {
		return NextResponse.next();
	}

	// Permitir acceso a rutas públicas sin autenticación
	if (publicRoutes.includes(req.nextUrl.pathname)) {
		return NextResponse.next();
	}

	// 🔐 Si el usuario intenta acceder sin token, redirigirlo al login
	if (!token) {
		return NextResponse.redirect(new URL('/', req.url));
	}

	return NextResponse.next();
}

// 🔥 Aplica el middleware a TODAS las rutas
export const config = {
	matcher: '/:path*', // ⬅️ Aplica el middleware a todas las rutas
};
