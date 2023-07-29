"use client"

import * as z from "zod"
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator";
import { AdditionalItem, AdditionalItemCategory, Category, Image, Product } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import Select from "react-select";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Preencha o nome"
    }),
    description: z.string().min(1, {
        message: "Preencha a descrição",
    }),
    maxQtdItems: z.coerce.number().int({ message: "Somente numero inteiro"}).min(0, {
        message: "Minimo é 0"
    }),
    status: z.boolean().default(true),
    productIds: z.string().array(),
    additionalItemsIds: z.string().array(),
})

type AdditionalItemCategoryFormValues = z.infer<typeof formSchema>;

interface AdditionalItemCategoryFormProps {
    initialDate: AdditionalItemCategory & {
        products: Product[]
        additionalItems: AdditionalItem[]
    } | null;
    additionalItems: { value: string, label: string }[];
    products: { value: string, label: string }[];
}

const AdditionalItemCategoryForm: React.FC<AdditionalItemCategoryFormProps> = ({
    initialDate,
    additionalItems,
    products
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const title = initialDate ? "Editar categoria de adicionais" : "Criar nova categoria de adicionais";
    const description = initialDate ? "Editar uma categoria de adicionais" : "Adicionar uma nova categoria de adicionais";
    const toastMessage = initialDate ? "Categoria atualizada." : "Categoria criada.";
    const action = initialDate ? "Salvar alterações" : "Criar";

    const form = useForm<AdditionalItemCategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate ? {
            ...initialDate,
            description: initialDate?.description || "",
        } : {
            name: "",
            description: "",
            maxQtdItems: 0,
            productIds: [],
            additionalItemsIds: [],
            status: true,
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: AdditionalItemCategoryFormValues) => {
        try {
            if (initialDate) {
                await axios.patch(`/api/additionalItemCategory/${initialDate.id}`, data);
            } else {
                await axios.post(`/api/additionalItemCategory`, data);
            }

            router.refresh();
            toast({
                description: toastMessage,
            });
            router.push(`/additionalCategories`);

        } catch(error) {
            toast({
                variant: "destructive",
                description: "Algo deu errado.",
            });
        }
    }

    const onDelete = async () => {
        try {
            await axios.delete(`/api/additionalItemCategory/${initialDate?.id}`);
            router.refresh();
            toast({
                description: "Produto deletado",
            });
            router.push(`/additionalCategories`);
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
                                            placeholder="Nome do produto"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="maxQtdItems"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantidade maxima de items</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            error={form.formState.errors.maxQtdItems}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.description}
                                            disabled={isLoading}
                                            placeholder="Informe um descrição"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="productIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Produtos</FormLabel>
                                    <Select
                                        value={products.filter((item) => field.value.includes(item.value))}
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions.map((option) => option.value);
                                            field.onChange(selectedValues);
                                        }}
                                        placeholder="Selecione"
                                        options={products}
                                        isMulti
                                        isDisabled={isLoading}
                                        closeMenuOnSelect={false}
                                        classNames={{
                                            
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="additionalItemsIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Itens adicionais</FormLabel>
                                    <Select
                                        value={additionalItems.filter((item) => field.value.includes(item.value))}
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions.map((option) => option.value);
                                            field.onChange(selectedValues);
                                        }}
                                        placeholder="Selecione"
                                        options={additionalItems}
                                        isMulti
                                        isDisabled={isLoading}
                                        closeMenuOnSelect={false}
                                        classNames={{
                                            
                                        }}
                                    />
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
                        {/* <FormField 
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select 
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value}
                                                    placeholder="Selecione uma categoria"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="additionalItemCategoryIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria de adicionais</FormLabel>
                                    <SelectMult
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
                        )}*/}
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

export default AdditionalItemCategoryForm