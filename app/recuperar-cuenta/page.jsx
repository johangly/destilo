'use client';

import Container from '@/components/Container';
import Link from 'next/link';

export default function ResetPassword() {
	return (
		<Container>
			<div className="w-full max-w-md mx-auto text-center">
				<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">Recuperar Contraseña</h1>
				<div className="flex flex-col space-y-4">
					<div className="flex flex-col">
						<p className="text-slate-800 dark:text-slate-100 text-lg mb-5">Que opción deseas realizar?</p>
					</div>
					<Link 
						href="/reset-password"
						className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md
						text-base font-medium transition-colors duration-200"
					>
						Recuperación por Correo
					</Link>
					<Link 
						href="/preguntas-de-seguridad"
						className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md
						text-base font-medium transition-colors duration-200"
					>
						Recuperación por Preguntas de Seguridad
					</Link>
				</div>
			</div>
		</Container>
	);
}
