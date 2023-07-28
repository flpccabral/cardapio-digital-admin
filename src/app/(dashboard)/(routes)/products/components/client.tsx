"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";

interface ProductsClientProps {
    data: ProductColumn[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({
    data
}) => {
    const router = useRouter();

    return (
        <div>
            <div className="flex items-center gap-2 justify-between">
                <Heading
                    title={`Produtos (${data.length})`}
                    description="Gerenciador de produtos para seu cardápio"
                />
                <Button 
                    onClick={() => router.push(`/products/new`)}
                    className="flex gap-2"
                >
                    <Plus className="h-4 w-4"/>
                    <span className="hidden sm:block">
                        Novo Produto
                    </span>
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
        </div>
    )
}

