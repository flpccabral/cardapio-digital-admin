"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [open, setOpen] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) return null;

    const handleNavigation = (href: string) => {
        router.push(href)
        setOpen(false)
    }
    
    return (
        <Sheet onOpenChange={(isOpen) => setOpen(isOpen)} open={open}>
            <SheetTrigger>
                <Button variant="ghost" size="icon">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
                <div className="flex flex-col gap-4 mt-8 px-4 sm:px-6 py-6">
                    <Button
                        onClick={() => handleNavigation('/settings')}
                        className="w-full text-base"
                    >
                        Configurações
                    </Button>
                    <Button
                        variant="destructive"
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