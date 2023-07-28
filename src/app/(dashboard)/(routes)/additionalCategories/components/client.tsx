"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdditionalCategoryColumn, columns } from "./columns";

interface AdditionalCategoriesClientProps {
    data: AdditionalCategoryColumn[];
}

export const AdditionalCategoriesClient: React.FC<AdditionalCategoriesClientProps> = ({
    data
}) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center gap-2 justify-between">
                <Heading
                    title={`Categorias de adicionais (${data.length})`}
                    description="Gerenciador de categorias de adicionais para seu cardápio"
                />
                <Button 
                    onClick={() => router.push(`/additionalCategories/new`)}
                    className="flex gap-2"
                >
                    <Plus className="h-4 w-4"/>
                    <span className="hidden sm:block">
                        Nova Categoria
                    </span>
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
        </>
    )
}

