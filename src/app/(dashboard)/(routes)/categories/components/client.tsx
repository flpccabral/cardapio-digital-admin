"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";

interface CategoriesClientProps {
    data: CategoryColumn[];
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({
    data
}) => {
    const router = useRouter();

    return (
        <>
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
            <DataTable searchKey="name" columns={columns} data={data}/>
        </>
    )
}

