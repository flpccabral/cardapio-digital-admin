import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(
    request: Request,
) {
    try {
        
        const menu = await prismadb.category.findMany({
            where: {
                status: true,
                products: {
                    some: {
                        status: true
                    }
                }
            },
            include: {
                products: {
                    where: {
                        status: true,
                    },
                    include: {
                        images: true,
                        additionalItemCategories: {
                            where: {
                                status: true,
                                additionalItems: {
                                    some: {
                                        status: true
                                    }
                                }
                            },
                            include: {
                                additionalItems: {
                                    where: {
                                        status: true
                                    },
                                    orderBy: {
                                        price: "asc"
                                    }
                                }
                            },
                            orderBy: {
                                order: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        price: "asc"
                    },
                },
            },
            orderBy: {
                order: 'asc'
            }
        })

        return NextResponse.json(menu);
    } catch(error) {
        console.log('[PUBLIC_MENU_GET]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}