"use client"

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

const nav = [
    {
        label: "Home",
        url: "/"
    },
    {
        label: "Categorias",
        url: "/categories"
    },
    {
        label: "Produtos",
        url: "/products"
    },
    {
        label: "Categorias de adicionais",
        url: "/additionalCategories"
    },
    {
        label: "Itens adicionais",
        url: "/additionalItems"
    },
]

const NavSwitcher = () => {
    const pathName = usePathname();
    const router = useRouter();

    // const formattedItems = items.map((item) => ({
    //     label: item.name,
    //     value: item.id 
    // }))


    const currentNav = nav.find((item) => {
        const path = pathName.split("/")[1]
        return (item.url === `/${path}`) 
    })

    const [open, setOpen] = useState(false);

    const onSelect = (item: { label: string, url: string }) => {
        setOpen(false);
        router.push(item.url);
    }
    

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="navegação"
                    className="w-[250px] justify-between"
                >
                    {/* <StoreIcon className="mr-2 h-4 w-4"/> */}
                    {currentNav?.label || 'Selecione'}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command >
                    <CommandList>
                        {/* <CommandInput placeholder="Search store..." /> */}
                        {/* <CommandEmpty>No store found.</CommandEmpty> */}
                        <CommandGroup 
                            // heading="Nav"
                        >
                            {nav.map((item) => (
                                <CommandItem
                                    key={item.label}
                                    onSelect={() => onSelect(item)}
                                    className="text-sm"
                                >
                                    {/* <StoreIcon className="mr-2 h-4 w-4" /> */}
                                    {item.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            currentNav?.label === item.label
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    {/* <CommandSeparator /> */}
                    {/* <CommandList>
                        <CommandGroup>
                            <CommandItem
                                className="cursor-pointer"
                                onSelect={() => {
                                    setOpen(false);
                                    storeModal.onOpen();
                                }}
                            >
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList> */}
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default NavSwitcher;