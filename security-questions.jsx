"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const predefinedQuestions = [
  "¿Cuál es el nombre de tu primera mascota?",
  "¿En qué ciudad naciste?",
  "¿Cuál es el nombre de soltera de tu madre?",
  "¿Cuál fue tu primer colegio?",
  "¿Cuál es el nombre de tu mejor amigo de la infancia?",
]

export default function SecurityQuestionsForm() {
  const [securityQuestions, setSecurityQuestions] = useState([{ question: "", answer: "", isCustom: false }])

  const addQuestion = () => {
    if (securityQuestions.length < 3) {
      setSecurityQuestions([...securityQuestions, { question: "", answer: "", isCustom: false }])
    }
  }

  const removeQuestion = (index) => {
    if (securityQuestions.length > 1) {
      const updatedQuestions = [...securityQuestions]
      updatedQuestions.splice(index, 1)
      setSecurityQuestions(updatedQuestions)
    }
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...securityQuestions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setSecurityQuestions(updatedQuestions)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Security questions submitted:", securityQuestions)
    // Here you would typically send the data to your backend
  }

  return (
    (<Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Preguntas de seguridad</CardTitle>
        <CardDescription>
          Establece preguntas de seguridad para proteger tu cuenta. Puedes seleccionar preguntas predefinidas o crear
          las tuyas propias.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {securityQuestions.map((item, index) => (
            <div key={index} className="space-y-4 border p-4 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium">Pregunta {index + 1}</h3>
                {securityQuestions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(index)}>
                    Eliminar
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`custom-${index}`}
                  checked={item.isCustom}
                  onCheckedChange={(checked) => {
                    updateQuestion(index, "isCustom", checked === true)
                    if (checked === false) {
                      updateQuestion(index, "question", "")
                    }
                  }} />
                <Label htmlFor={`custom-${index}`}>Personalizar pregunta</Label>
              </div>

              {item.isCustom ? (
                <div className="space-y-2">
                  <Label htmlFor={`custom-question-${index}`}>Pregunta personalizada</Label>
                  <Input
                    id={`custom-question-${index}`}
                    value={item.question}
                    onChange={(e) => updateQuestion(index, "question", e.target.value)}
                    placeholder="Escribe tu pregunta personalizada"
                    required />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor={`predefined-question-${index}`}>Selecciona una pregunta</Label>
                  <Select
                    value={item.question}
                    onValueChange={(value) => updateQuestion(index, "question", value)}>
                    <SelectTrigger id={`predefined-question-${index}`}>
                      <SelectValue placeholder="Selecciona una pregunta" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedQuestions.map((question, qIndex) => (
                        <SelectItem key={qIndex} value={question}>
                          {question}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`answer-${index}`}>Respuesta</Label>
                <Input
                  id={`answer-${index}`}
                  value={item.answer}
                  onChange={(e) => updateQuestion(index, "answer", e.target.value)}
                  placeholder="Escribe tu respuesta"
                  required />
              </div>
            </div>
          ))}

          {securityQuestions.length < 3 && (
            <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
              Añadir otra pregunta
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Guardar preguntas de seguridad
          </Button>
        </CardFooter>
      </form>
    </Card>)
  );
}

