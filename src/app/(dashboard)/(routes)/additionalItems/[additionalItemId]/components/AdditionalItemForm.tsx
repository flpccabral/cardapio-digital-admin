"use client"

import * as z from "zod"
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator";
import { AdditionalItem, AdditionalItemCategory } from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/AlertModal";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Select from "react-select";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Preencha o nome"
    }),
    price: z.coerce.number().min(1, {
        message: "Preencha o preço"
    }),
    status: z.boolean().default(true),
    additionalItemCategoryIds: z.string().array(),
})

type AdditionalItemFormValues = z.infer<typeof formSchema>;

interface AdditionalItemFormProps {
    initialDate: AdditionalItem & {
        additionalItemCategory: AdditionalItemCategory[]
    } | null;
    additionalItemCategories: { value: string, label: string }[];
}

const AdditionalItemForm: React.FC<AdditionalItemFormProps> = ({
    initialDate,
    additionalItemCategories,
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const title = initialDate ? "Editar item adicional" : "Criar novo adicional";
    const description = initialDate ? "Editar uma item adicional" : "Adicionar uma novo item adicional";
    const toastMessage = initialDate ? "Item atualizado." : "Item criado.";
    const action = initialDate ? "Salvar alterações" : "Criar";

    const form = useForm<AdditionalItemFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate ? {
            ...initialDate,
        } : {
            name: "",
            price: 0,
            status: true,
            additionalItemCategoryIds: []
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: AdditionalItemFormValues) => {
        try {
            if (initialDate) {
                await axios.patch(`/api/additionalItem/${initialDate.id}`, data);
            } else {
                await axios.post(`/api/additionalItem`, data);
            }

            router.refresh();
            toast({
                description: toastMessage,
            });
            router.back();

        } catch(error) {
            toast({
                variant: "destructive",
                description: "Algo deu errado.",
            });
        }
    }

    const onDelete = async () => {
        try {
            await axios.delete(`/api/additionalItem/${initialDate?.id}`);
            router.refresh();
            toast({
                description: "Item deletado",
            });
            router.back()
        } catch(error) {
            toast({
                variant: "destructive",
                description: "Algo deu errado.",
            });
        }
    }

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={()=>setOpen(false)}
                onConfirm={onDelete}
                loading={isLoading}
            />
            <div className="flex items-center justify-between gap-2">
                <Heading
                    title={title}
                    description={description}
                />
                {initialDate && (
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
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
                                            placeholder="Nome do Item"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preço</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            error={form.formState.errors.price}
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
                            name="additionalItemCategoryIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select
                                        value={additionalItemCategories.filter((item) => field.value.includes(item.value))}
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions.map((option) => option.value);
                                            field.onChange(selectedValues);
                                        }}
                                        placeholder="Selecione"
                                        options={additionalItemCategories}
                                        isMulti
                                        isDisabled={isLoading}
                                        closeMenuOnSelect={false}
                                        classNames={{
                                            
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {initialDate && (
                            <FormField 
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-6 pt-2">
                                                <Switch
                                                    disabled={isLoading}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <Label className={field.value ? "text-green-500" : "text-red-500"}>
                                                    {field.value ? 'Ativo' : 'Inativo'}
                                                </Label>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div> 
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="ml-auto"
                        >
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
            <Separator />
        </>
    )
}

export default AdditionalItemForm