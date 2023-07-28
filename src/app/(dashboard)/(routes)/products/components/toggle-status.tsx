"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductColumn } from "./columns";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface ToggleStatus {
    data: ProductColumn
}

export const ToggleStatus: React.FC<ToggleStatus> = ({
    data
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const updateStatus = async () => {
        try {
          setIsLoading(true)

          await axios.patch(`/api/product/${data.id}`, {
            status: !data.status
          })
          toast({
            description: "Status alterado!"
          })
          router.refresh();
        } catch(error) {
          toast({
            variant: "destructive",
            description: "Algo deu errado."
          })
        } finally {
          setIsLoading(false)
        }
    }

    return (
        <Button
            disabled={isLoading}
            variant="ghost"
            onClick={() => updateStatus()}
            className="px-0"
        >
            <span className={data.status ? "text-green-500" : "text-red-500"}>
            {data.status ? "Ativo" : "Inativo"}
            </span>
        </Button>
    )
}
