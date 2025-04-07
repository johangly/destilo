"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SecurityQuestionsRecovery() {
  const router = useRouter()
  const [answers, setAnswers] = useState(["", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // These would typically come from your backend based on the user's email/username
  const securityQuestions = [
    "¿Cuál fue el nombre de tu primera mascota?",
    "¿En qué ciudad naciste?",
    "¿Cuál es el nombre de tu mejor amigo de la infancia?",
  ]

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // This would be replaced with your actual API call
      // const response = await fetch('/api/account-recovery/verify-answers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ answers })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll just check if answers aren't empty
      const allAnswered = answers.every((answer) => answer.trim().length > 0)

      if (allAnswered) {
        setSuccess(true)
        // Redirect after showing success message
        setTimeout(() => {
          router.push("/reset-password")
        }, 2000)
      } else {
        setError("Por favor, responde todas las preguntas de seguridad.")
      }
    } catch (err) {
      setError(
        "Ha ocurrido un error al verificar tus respuestas. Por favor intenta nuevamente."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    (<div className="container max-w-md mx-auto py-10">
      <Card>
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

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {securityQuestions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`question-${index}`}>{question}</Label>
                  <Input
                    id={`question-${index}`}
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    disabled={isSubmitting || success}
                    placeholder="Tu respuesta"
                    required />
                </div>
              ))}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || success}
            className="w-full">
            {isSubmitting ? "Verificando..." : "Verificar respuestas"}
          </Button>
        </CardFooter>
      </Card>
    </div>)
  );
}

