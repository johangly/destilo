import { auth } from '@/lib/firebase';
import {
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
} from 'firebase/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
	const body = await request.json();
	const { email, password, action } = body;

	if (!email) {
		return NextResponse.json(
			{ error: 'El email es obligatorio' },
			{ status: 400 }
		);
	}

	try {
		if (action === 'login') {
			if (!password) {
				return NextResponse.json(
					{ error: 'La contraseña es obligatoria' },
					{ status: 400 }
				);
			}

			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			return NextResponse.json({
				message: 'Inicio de sesión exitoso',
				user: userCredential.user,
			});
		}

		if (action === 'reset') {
			await sendPasswordResetEmail(auth, email);
			return NextResponse.json({
				message: 'Correo de recuperación enviado con éxito',
			});
		}

		return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
