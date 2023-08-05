"use client"

import * as z from "zod"
import { Address, Restaurant } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Preencha o nome"
    }),
    logo: z.string(),
    phone: z.string(),
    whatsapp: z.string().min(11, {
        message: 'O número do WhatsApp deve ter 11 dígitos'
    }).max(11, {
        message: 'O número do WhatsApp deve ter 11 dígitos'
    }),
    email: z.string().email({
        message: "Preencha um email válido"
    }),
    colorHeader: z.string().min(3, {
        message: "Insira pelo menos três caracteres"
    }),
    colorDetails: z.string().min(3, {
        message: "Insira pelo menos três caracteres"
    }),
    address: z.object({
        streetAddress: z.string().min(1, {
            message: "Preenche o endereço"
        }),
        number: z.coerce.number().min(1, {
            message: "Preenche o número"
        }),
        complement: z.string(),
        neighborhood: z.string().min(1, {
            message: "Preenche a bairro"
        }),
        city: z.string().min(1, {
            message: "Preenche a cidade"
        }),
        state: z.string().min(2, {
            message: "Preenche o estado"
        }).max(2, {
            message: "Máximo 2 caracteres"
        }),
        zipCode: z.coerce.number().min(9999999, {
            message: "Preenche o CEP"
        }).max(99999999, {
            message: "CEP inválido"
        }),
        country: z.string().min(1, {
            message: "Preencha o País"
        })
    }),
})

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
    initialDate: Restaurant & {
        address: Address | null
    } | null;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
    initialDate
}) => {
    const router = useRouter();
    
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate ? {
            ...initialDate,
            logo: initialDate.logo || "",
            phone: initialDate.phone || "",
            address: initialDate?.address ? {
                ...initialDate.address,
                complement: initialDate.address.complement || "",
                number: parseInt(String(initialDate.address.number)),
                zipCode: parseInt(String(initialDate.address.zipCode))
            } : {
                streetAddress: "",
                city: "",
                complement: "",
                zipCode: undefined,
                state: "",
                country: "",
                neighborhood: "",
                number: undefined,
            },
        } : {
            name: "",
            phone: "",
            whatsapp: "",
            email: "",
            logo: "",
            colorDetails: "",
            colorHeader: "",
            address: {
                streetAddress: "",
                number: undefined,
                city: "",
                complement: "",
                state: "",
                country: "",
                neighborhood: "",
                zipCode: undefined,
            }
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            await axios.patch(`/api/restaurant/`, data);

            router.refresh();
            toast({
                description: "Dados atualizado.",
            });
            router.push("/");

        } catch(error) {
            toast({
                variant: "destructive",
                description: "Algo deu errado.",
            });
        }
    }
    
    return (
        <>
            <Heading
                title="Atualizar Informações"
                description="Atualizar Informações do estabelecimento"
            />
            <Separator />
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <FormField 
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Logo</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={isLoading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.name}
                                            disabled={isLoading}
                                            placeholder="Nome do estabelecimento"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.email}
                                            type="email"
                                            disabled={isLoading}
                                            placeholder="Ex: email@gmail.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.phone}
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="Ex: 99 99999999"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="whatsapp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>WhatsApp</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.whatsapp}
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="Ex: 99 99999999"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="colorHeader"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cor do cabeçalho</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.colorHeader}
                                            type="color"
                                            disabled={isLoading}
                                            placeholder="Ex: #FFF"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="colorDetails"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cor dos detalhes</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.colorDetails}
                                            type="color"
                                            disabled={isLoading}
                                            placeholder="Ex: #FFF"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Separator />
                    <Heading
                        title="Endereço"
                        // description="Atualizar Informações do estabelecimento"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-8">
                        <FormField 
                            control={form.control}
                            name="address.zipCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CEP</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.address?.zipCode}
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="Ex: 99999999"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-8">
                        <FormField 
                            control={form.control}
                            name="address.streetAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endereço</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.address?.streetAddress}
                                            disabled={isLoading}
                                            placeholder="Ex: Rua São João"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="address.number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.address?.number}
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="Ex: 101"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="address.complement"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.address?.complement}
                                            disabled={isLoading}
                                            placeholder="Ex: Casa 1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="address.neighborhood"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bairro</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.address?.neighborhood}
                                            disabled={isLoading}
                                            placeholder="Ex: Vila Velha"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="address.city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.address?.city}
                                            disabled={isLoading}
                                            placeholder="Ex: Rio de Janeiro"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="address.state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.address?.state}
                                            disabled={isLoading}
                                            placeholder="Ex: RJ"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="address.country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>País</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.address?.country}
                                            disabled={isLoading}
                                            placeholder="Ex: Brasil"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="ml-auto"
                        >
                            Atualizar
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default SettingsForm;