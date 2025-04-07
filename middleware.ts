import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const token = req.cookies.get('token')?.value;

	// Excluir archivos estáticos (CSS, JS, imágenes, fuentes, etc.)
	const isStaticAsset =
	req.nextUrl.pathname.startsWith('/_next') ||
	req.nextUrl.pathname.startsWith('/favicon.ico') ||
	req.nextUrl.pathname.startsWith('/public') ||
	req.nextUrl.pathname.startsWith('/api') ||
	/\.(svg|png|jpg|jpeg|gif|ico|webp|pdf|css|js)$/.test(req.nextUrl.pathname);
	
	if (isStaticAsset) {
		return NextResponse.next();
	}

	// 🔥 Rutas públicas
	const publicRoutes = ['/','/soporte','/reset-password','/recuperar-cuenta','/manual','/preguntas-de-seguridad', '/about', '/contact','/activar-cuenta/:token', '/reset-password/:token'];

	const isPublicRoute = publicRoutes.some((route) => {
        if (route.includes(':token')) {
			const routePattern = new RegExp(`^${route.replace(':token', '[^/]+')}$`);
			return routePattern.test(req.nextUrl.pathname);
        }
        // Si no es dinámica, comparar directamente
        return route === req.nextUrl.pathname;
    });

	// Permitir acceso a rutas públicas sin autenticación
	if (isPublicRoute) {
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
