"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

const Sidebar = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) return null;
    
    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="ghost" size="icon">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
                <div className="flex flex-col gap-4 mt-8 px-4 sm:px-6 py-6">
                    <Button
                        className="w-full text-base"
                    >
                        Configuração
                    </Button>
                    <Button
                        onClick={() => signOut()}
                        className="w-full text-base"
                    >
                        sair
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Sidebar;