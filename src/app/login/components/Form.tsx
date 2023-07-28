"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react';
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    email: z.string().email({
        message: 'Email inválido'
    }),
    password: z.string().min(1,{
        message: 'Preencha a senha'
    })
})

const LoginForm = () => {
    const router = useRouter();
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await signIn('credentials', {
                ...values,
                redirect: false,
            })

            if (response?.ok && !response.error) {
                toast({
                    // title: "",
                    description: "Logado com sucesso!",
                });
                router.refresh();
            }

            if (response?.error) {
                toast({
                    variant: "destructive",
                    // title: "Email ou senha inválido!",
                    description: "Email ou senha inválido!",
                });
                form.reset();
            }
            
        } catch(error) {
            console.log(error)
            toast({
                variant: "destructive",
                // title: "",
                description: "Erro interno!",
            })
            form.reset()
        }
    }

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    error={form.formState.errors.email}
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input
                                    error={form.formState.errors.password}
                                    disabled={isLoading}
                                    type="password"
                                    autoComplete="password"
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end pt-4">
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-full"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Entar'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default LoginForm;