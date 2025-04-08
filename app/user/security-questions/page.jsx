"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Container from "@/components/Container"
import { useAuth } from "@/context/AuthContext"
import BackButton from "@/components/BackButton"

const predefinedQuestions = [
    "¿Cuál es el nombre de tu primera mascota?",
    "¿En qué ciudad naciste?",
    "¿Cuál es el nombre de soltera de tu madre?",
    "¿Cuál fue tu primer colegio?",
    "¿Cuál es el nombre de tu mejor amigo de la infancia?",
]

export default function SecurityQuestionsForm() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true)
    const [securityQuestions, setSecurityQuestions] = useState([{ question: "", answer: "", isCustom: false }])
    const [userHasQuestions, setUserHasQuestions] = useState(false)

    const addQuestion = () => {
        if (securityQuestions.length <= 4) {
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
        updatedQuestions[index][field] = value
        setSecurityQuestions(updatedQuestions)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user || !user.role) {
			throw new Error('No hay sesión activa');
		}
        const response = await fetch('/api/createSecurityQuestions', {
            method: 'POST',
            headers: {
                'X-User-Role': user.role ? user.role.toString() : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user.id,
                questions: securityQuestions
            }),
        });

        if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Error del servidor: ${errorText}`);
		}

        if(userHasQuestions) {
            alert('Preguntas de seguridad actualizadas correctamente');
        } else {
            alert('Preguntas de seguridad agregadas correctamente');
        }

		const data = await response.json();
        return data;
    }

    async function fetchSecurityQuestions() {
        try {
            const response = await fetch('/api/getSecurityQuestions', {
                method: 'GET',
                headers: {
                    'X-User-Role': user.role ? user.role.toString() : '',
                    'X-User-Id': user.id ? user.id.toString() : '',
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${errorText}`);
            }
    
            const data = await response.json();
            if(data.questions) {
                const formattedQuestions = data.questions
                    .sort((a, b) => a.question_order - b.question_order)
                    .map(q => ({
                        id: q.id,
                        question: q.question_text,
                        answer: "",
                        order: q.question_order,
                        isCustom: q.is_custom
                    }));
                setSecurityQuestions(formattedQuestions.length > 0 ? formattedQuestions : [{ question: "", answer: "", isCustom: false }]);
                setUserHasQuestions(formattedQuestions.length > 0);
            } else {
                setUserHasQuestions(false);
            }
        } catch (error) {
            setSecurityQuestions([{ question: "", answer: "", isCustom: false }])
            setUserHasQuestions(false);
            console.error('Error al obtener preguntas de seguridad:', error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchSecurityQuestions();
            setLoading(false);
        }
    }, [user]);

    return (
        <Container>
            <Card className="w-full rounded max-w-lg mx-auto my-[40px] dark:bg-slate-700 text-slate-800 dark:text-slate-100">
                <div className='flex items-center justify-start w-full mb-2 px-6'>
                <BackButton
                    href='/user'
                    text='Volver'
                    iconSrc='/backIcon.svg'
                />
                </div>
                <CardHeader>
                    <CardTitle>Preguntas de seguridad</CardTitle>
                    <CardDescription>
                        Establece preguntas de seguridad para proteger tu cuenta. Puedes seleccionar preguntas predefinidas o crear
                        las tuyas propias.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    {loading === true 
                    ?
                    <div className="text-center flex justify-center items-center mb-5 min-h-[300px]">
                        <span>Cargando...</span>
                    </div>
                    :   (
                    <CardContent className="space-y-6 mb-5">
                        {securityQuestions.map((item, index) => (
                            <div key={index} className="space-y-4 border p-4 rounded-md">
                                {/* Titulo de la pregunta */}
                                <div className="flex items-center justify-between">
                                <h3 className="text-md font-medium">Pregunta {index + 1}</h3>
                                {securityQuestions.length > 1 && (
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                                        Eliminar
                                    </Button>
                                )}
                            </div>

                            {/* Checkbox para preguntas personalizadas */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id={`custom-${index}`}
                                    checked={item.isCustom}
                                    onCheckedChange={(checked) => {
                                        console.log(checked,'checked')
                                        console.log(index,'index')
                                        if (checked === false) {
                                            updateQuestion(index, "isCustom", false)
                                            updateQuestion(index, "question", "")
                                        } else {
                                            updateQuestion(index, "isCustom", true)
                                        }

                                    }}
                                />
                                <Label htmlFor={`custom-${index}`}>Personalizar pregunta</Label>
                            </div>

                            {/* Pregunta personalizada */}
                            {item.isCustom ? (
                                <div className="space-y-2">
                                    <Label htmlFor={`custom-question-${index}`}>Pregunta personalizada</Label>
                                    <Input
                                        id={`custom-question-${index}`}
                                        value={item.question}
                                        onChange={(e) => updateQuestion(index, "question", e.target.value)}
                                        placeholder="Escribe tu pregunta personalizada"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label htmlFor={`predefined-question-${index}`}>Selecciona una pregunta</Label>
                                    <Select value={item.question} onValueChange={(value) => updateQuestion(index, "question", value)}>
                                        <SelectTrigger className="w-full" id={`predefined-question-${index}`}>
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

                            {/* Respuesta de la pregunta */}
                            <div className="space-y-2">
                                <Label htmlFor={`answer-${index}`}>Respuesta</Label>
                                <Input
                                    id={`answer-${index}`}
                                    value={item.answer}
                                    onChange={(e) => updateQuestion(index, "answer", e.target.value)}
                                    placeholder="Escribe tu respuesta"
                                    required
                                />
                            </div>
                            </div>
                        ))}

                        {securityQuestions.length < 5 && (
                            <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
                                Añadir otra pregunta
                            </Button>
                        )}
                    </CardContent>
                    )}
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            { userHasQuestions ? "Actualizar preguntas de seguridad" : "Agregar preguntas de seguridad"}
                        </Button>
                    </CardFooter>
                </form> 
            </Card>
        </Container>
    )
}

