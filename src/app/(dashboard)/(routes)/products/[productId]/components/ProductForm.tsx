"use client"

import * as z from "zod"
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator";
import { AdditionalItemCategory, Category, Image, Product } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectMult from "react-select";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Preencha o nome"
    }),
    description: z.string(),
    price: z.coerce.number().min(1, {
        message: "Preencha o preço"
    }),
    images: z.object({ url: z.string() }).array(),
    status: z.boolean().default(true),
    categoryId: z.string().min(1, {
        message: "Selecione uma categoria"
    }),
    additionalItemCategoryIds: z.string().array(),
})

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialDate: Product & {
        images: Image[],
        category: Category,
        additionalItemCategories: AdditionalItemCategory[]
    } | null;
    categories: Category[];
    additionalItemCategories: { value: string, label: string }[]
}

const ProductForm: React.FC<ProductFormProps> = ({
    initialDate,
    categories,
    additionalItemCategories,
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const title = initialDate ? "Editar produto" : "Criar produto";
    const description = initialDate ? "Editar um produto" : "Adicionar um novo produto";
    const toastMessage = initialDate ? "Produto atualizado." : "Produto criado.";
    const action = initialDate ? "Salvar alterações" : "Criar";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate ? {
            ...initialDate,
            description: initialDate?.description || "",
            price: parseFloat(String(initialDate.price))
        } : {
            name: "",
            description: "",
            images: [],
            price: 0,
            status: true,
            categoryId: "",
            additionalItemCategoryIds: []
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: ProductFormValues) => {
        try {
            if (initialDate) {
                await axios.patch(`/api/product/${initialDate.id}`, data);
            } else {
                await axios.post(`/api/product`, data);
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
            await axios.delete(`/api/product/${initialDate?.id}`);
            router.refresh();
            toast({
                description: "Produto deletado",
            });
            router.back();
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
            <div className="flex items-center justify-between">
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
                    <FormField 
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Imagens</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        value={field.value.map((image) => image.url)}
                                        disabled={isLoading}
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
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
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preço</FormLabel>
                                    <FormControl>
                                        <Input
                                            error={form.formState.errors.price}
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="0.00"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
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
                        )}
                    </div>
                    <FormField 
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição</FormLabel>
                                <FormControl>
                                    <Textarea
                                        error={form.formState.errors.description}
                                        disabled={isLoading}
                                        placeholder="Descrição do produto"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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

export default ProductForm