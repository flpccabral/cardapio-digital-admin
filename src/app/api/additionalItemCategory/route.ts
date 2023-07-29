import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    // { params }: { params: { storeId: string }}
) {
    try {
        // const additionalItemCategoryId = '64beff784eed2281f907a9eb'
        // const todosProdutosComId = await prismadb.product.findMany({
        //     where: {
        //         additionalItemCategories: {
        //             every: {
        //                 id: additionalItemCategoryId
        //             }
        //         }
        //     }
        // })

        // return NextResponse.json(todosProdutosComId);

        const additionalItemCategory = await prismadb.additionalItemCategory.findMany({
            include: {
                additionalItems: true,
            }
        })

        return NextResponse.json(additionalItemCategory);
    } catch(error) {
        console.log('[ADDITIONAL_ITEM_CATEGORY_GET]', error)
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
            maxQtdItems,
            status,
            productIds,
            additionalItemsIds
        } = body;

        if (!maxQtdItems) {
            return new NextResponse("Category id is required", { status: 400 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!description) {
            return new NextResponse("Price is required", { status: 400 })
        }
        
        const newAdditionalItemCategory = await prismadb.additionalItemCategory.create({
            data: {
                name,
                description,
                maxQtdItems,
                status,
                productIds: {
                    set: productIds
                },
                additionalItemsIds: {
                    set: additionalItemsIds
                }
            }
        })

        if (productIds?.length) {
            await prismadb.product.updateMany({
                where: {
                    id: {
                        in: productIds
                    }
                },
                data: {
                    additionalItemCategoryIds: {
                        push: newAdditionalItemCategory.id
                    },
                }
            })
        }

        return NextResponse.json(newAdditionalItemCategory);
    } catch(error) {
        console.log('[ADDITIONAL_ITEM_CATEGORY_POST]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}