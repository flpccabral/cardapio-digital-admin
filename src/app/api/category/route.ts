import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    // { params }: { params: { storeId: string }}
) {
    try {
        const categories = await prismadb.category.findMany({
            include: {
                products: {
                    include: {
                        images: true,
                        additionalItemCategories: {
                            include: {
                                additionalItems: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(categories);
    } catch(error) {
        console.log('[CATEGORY_GET]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}


export async function POST(
    request: Request,
) {
    try {
        const body = await request.json();
        
        const {
            name
        } = body;

        const lastCategory = await prismadb.category.findFirst({
            orderBy: {
                createdAt: 'desc'
            }
        })

        const newCategory = await prismadb.category.create({
            data: {
                name,
                order: lastCategory ? (lastCategory?.order + 1) : 0
            }
        })

        return NextResponse.json(newCategory);
    } catch(error) {
        console.log('[CATEGORY_POST]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}

export async function PATCH(
    request: Request,
) {
    try {
        const body = await request.json();

        const {
            data
        } = body;

        const categories = await prismadb.category.findMany()

        if (categories.length !== data.length) {
            return new NextResponse("Categories invalids", { status: 400 })
        }

        for (const category of data) {
            const index = data.indexOf(category)

            await prismadb.category.update({
                where: {
                    id: category.id
                },
                data: {
                    order: index
                }
            })
        }

        return NextResponse.json({})
    } catch(error) {
        console.log('[PRODUCT_PATCH', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}