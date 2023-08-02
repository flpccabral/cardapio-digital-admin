"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface ToggleStatus {
    url: string;
    status: boolean;
}

export const ToggleStatus: React.FC<ToggleStatus> = ({
    url,
    status
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const updateStatus = async () => {
        try {
          setIsLoading(true)

          await axios.patch(url, {
            status
          });
          toast({
            description: "Status alterado!"
          });
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
            <span className={status ? "text-green-500" : "text-red-500"}>
            {status ? "Ativo" : "Inativo"}
            </span>
        </Button>
    )
}
