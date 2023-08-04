"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdditionalItemColumn, columns } from "./columns";

interface AdditionalItemsClientProps {
    data: AdditionalItemColumn[];
}

export const AdditionalItemsClient: React.FC<AdditionalItemsClientProps> = ({
    data
}) => {
    const router = useRouter();

    return (
        <div>
            <div className="flex items-center gap-2 justify-between">
                <Heading
                    title={`Itens de adicionais (${data.length})`}
                    description="Gerenciador de itens de adicionais para seu cardápio"
                />
                <Button 
                    onClick={() => router.push(`/additionalItems/new`)}
                    className="flex gap-2"
                >
                    <Plus className="h-4 w-4"/>
                    <span className="hidden sm:block">
                        Novo Item
                    </span>
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
        </div>
    )
}

