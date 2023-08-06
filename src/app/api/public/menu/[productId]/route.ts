import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse("Product id is require", { status: 400 })
        }

        const product = await prismadb.product.findUnique({
            where: {
                status: true,
                id: params.productId,
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
                                status: true,
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
            }
        })

        return NextResponse.json(product)
    } catch(error) {
        console.log('[PUBLIC_MENU_PRODUCT_GET', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}
