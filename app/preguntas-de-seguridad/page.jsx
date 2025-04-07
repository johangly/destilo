'use client';

import Container from '@/components/Container';
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function ResetPassword() {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const [formStep, setFormStep] = useState(1)
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState(false)

	// These would typically come from your backend based on the user's email/username
	const [securityQuestions, setSecurityQuestions] = useState({
		userId: 0,
		email: email,
		questions: []
	})

	const handleAnswerChange = (index, value) => {
		const newAnswers = [...securityQuestions.questions]
		newAnswers[index].answer = value
		setSecurityQuestions({ ...securityQuestions, questions: newAnswers })
	}
	
	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")
		if(email === '') {
			setError("Por favor, ingresa un correo electrónico.")
			return
		}

		try {
			// const response = await fetch('/api/getSecurityQuestionsByEmail', {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({ email }),
			// }); 
			const response = await fetch('/api/getSecurityQuestionsByEmail', {
				method: 'GET',
				headers: {
					'X-User-Email': email,
					'Content-Type': 'application/json'
    			}
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.message);

			if(!data.questions) {
				setError('No se encontraron preguntas de seguridad');
				return;
			}

			const formattedQuestions = data.questions
			.sort((a, b) => a.question_order - b.question_order)
			.map(q => ({
				id: q.id,
				question: q.question_text,
				answer: "",
				order: q.question_order,
			}));
			
			setSecurityQuestions({
				userId: data.userId,
				email: data.email,
				questions: formattedQuestions ? formattedQuestions : []
			})
			setFormStep(2)

		} catch (error) {
			setError(error.message);
			setIsSubmitting(false)
		}
	}

	const handleValidateSecurityQuestions = async (e) => {
		e.preventDefault();
		setMessage('');
		if(!securityQuestions.userId) {
			setError('El usuario no existe');
			return;
		}
		if(!securityQuestions.questions.length) {
			setError('No se encontraron preguntas de seguridad');
			return;
		}
		try {
			const response = await fetch('/api/validateSecurityQuestions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: securityQuestions.userId, questions: securityQuestions.questions }),
			}); 

			const data = await response.json();
			if (!response.ok) throw new Error(data.message);
			if(!data.token) throw new Error('No se genero un token de recuperacion');
			
			console.log(data)
			setMessage('Respuestas verificadas correctamente.');
			setSuccess(true);
			setTimeout(() => {
				router.push(`/reset-password/${data.token}`)
			}, 3000);
		} catch (error) {
			setMessage(error.message);
		}
	};

	return (
		<Container>
			{/* Formulario para ingresar correo y buscar preguntas de seguridad */}
			{formStep === 1 && (
				<div className="w-full max-w-md mx-auto text-center">
					<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">Recuperar Contraseña</h1>
					<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
						<div className="flex flex-col">
							<p className="text-slate-800 dark:text-slate-100 text-lg mb-5">Ingrese su correo para iniciar el proceso de recuperación</p>
							{error && (
								<Alert variant="destructive" className="mb-6">
								  <AlertCircle className="h-4 w-4" />
								  <AlertDescription>{error}</AlertDescription>
								</Alert>
							  )}
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								placeholder="tucorre@gmail.com"
								className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-md 
								bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100
								focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<button 
							type="submit"
							className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md
							text-base font-medium transition-colors duration-200"
						>
							Iniciar
						</button>
					</form>
					{message && (
						<p className={`mt-4 text-base font-semibold ${
							message.toLowerCase().includes('error') 
								? 'text-red-500 dark:text-red-400' 
								: 'text-green-500 dark:text-green-400'
						}`}>
							{message}
						</p>
					)}
				</div>
			)}
			{formStep === 2 && (
				<Card className="w-full rounded max-w-lg mx-auto my-[40px] dark:bg-slate-700 text-slate-800 dark:text-slate-100">
					<CardHeader>
					  <CardTitle>Recuperación de cuenta</CardTitle>
					  <CardDescription>
						Responde las preguntas de seguridad que configuraste anteriormente para recuperar tu cuenta.
					  </CardDescription>
			</CardHeader>
			<CardContent>
			  {error && (
				<Alert variant="destructive" className="mb-6">
				  <AlertCircle className="h-4 w-4" />
				  <AlertDescription>{error}</AlertDescription>
				</Alert>
			  )}
	
			  {success && (
				<Alert className="mb-6 border-green-500 text-green-500">
				  <CheckCircle2 className="h-4 w-4" />
				  <AlertDescription>
					Respuestas verificadas correctamente. Redirigiendo a la página de restablecimiento de contraseña...
				  </AlertDescription>
				</Alert>
			  )}
	
			  <form onSubmit={handleValidateSecurityQuestions}>
				<div className="space-y-6">
				  {securityQuestions.questions.map((question, index) => (
					<div key={index} className="space-y-2">
					  <Label htmlFor={`question-${index}`}>{question.question}</Label>
					  <Input
						id={`question-${index}`}
						value={question.answer}
						onChange={(e) => handleAnswerChange(index, e.target.value)}
						disabled={isSubmitting || success}
						placeholder="Tu respuesta"
						required
					  />
					</div>
				  ))}
				</div>
			  </form>
			</CardContent>
			<CardFooter>
			  <Button onClick={handleValidateSecurityQuestions} disabled={isSubmitting || success} className="w-full">
				{isSubmitting ? "Verificando..." : "Verificar respuestas"}
			  </Button>
			</CardFooter>
				</Card>	
			)}
		</Container>
	);
}