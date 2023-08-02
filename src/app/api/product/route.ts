import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    // { params }: { params: { storeId: string }}
) {
    try {
        const products = await prismadb.product.findMany({
            include: {
                images: true,
                additionalItemCategories: {
                    include: {
                        additionalItems: true
                    }
                }
            }
        })

        return NextResponse.json(products);
    } catch(error) {
        console.log('[PRODUCTS_GET]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}


export async function POST(
    request: Request,
) {
    try {
        const body = await request.json();
        
        const {
            name,
            description,
            price,
            images,
            categoryId,
            additionalItemCategoryIds
        } = body;
        
        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 })
        }

        // if (!additionalItemCategoryId) {
        //     return new NextResponse("Additional Item Category id is required", { status: 400 })
        // }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 })
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: categoryId
            }
        })

        if (!category) {
            return new NextResponse("Category id not exist", { status: 404 })
        }

        // const additionalItemCategory = await prismadb.additionalItemCategory.findUnique({
        //     where: {
        //         id: additionalItemCategoryId
        //     }
        // })

        // if (!additionalItemCategory) {
        //     return new NextResponse("Additional Item Category id not exist", { status: 404 })
        // }
        
        // let dataAdditionalItemCategoryIds = []

        // if (additionalItemCategoryIds?.length) {
        //     dataAdditionalItemCategoryIds = [...additionalItemCategoryIds]
        // }

        const newProduct = await prismadb.product.create({
            data: {
                name,
                price,
                description,
                categoryId,
                images: {
                    create: images?.map((image: { url: string }) => ({
                        url: image.url
                    }))
                },
                additionalItemCategoryIds: {
                    set: additionalItemCategoryIds
                }
            }
        })


        if (additionalItemCategoryIds?.length) {
            await prismadb.additionalItemCategory.updateMany({
                where: {
                    id: {
                        in: additionalItemCategoryIds
                    }
                },
                data: {
                    productIds: {
                        push: newProduct.id
                    }
                }
            })
        }
        

        return NextResponse.json(newProduct);
    } catch(error) {
        console.log('[PRODUCTS_POST]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}