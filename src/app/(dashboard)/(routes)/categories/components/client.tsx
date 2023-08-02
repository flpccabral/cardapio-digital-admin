"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { ReoderModal, ReoderType } from "@/components/modals/ReoderModal";
import { useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

interface CategoriesClientProps {
    data: CategoryColumn[];
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({
    data
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSetReoder = async (data: ReoderType[]) => {
        try {
            setLoading(true)
            await axios.patch('/api/category', {
                data
            })
            toast({
                description: "Ordem atualizada.",
            });
            router.refresh();
        } catch(error) {
            toast({
                variant: "destructive",
                description: "Algo deu errado.",
            });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            {open && (
                <ReoderModal 
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onConfirm={(categories) => handleSetReoder(categories)}
                    loading={loading}
                    initialData={data}
                />
            )}
            <div className="flex items-center gap-2 justify-between">
                <Heading
                    title={`Categorias (${data.length})`}
                    description="Gerenciador de categorias para seu cardápio"
                />
                <Button 
                    onClick={() => router.push(`/categories/new`)}
                    className="flex gap-2"
                >
                    <Plus className="h-4 w-4"/>
                    <span className="hidden sm:block">
                        Nova Categoria
                    </span>
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} onClickReorder={() => setOpen(true)}/>
        </>
    )
}

