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
            additionalItemsIds,
            isRequired
        } = body;

        if (!maxQtdItems) {
            return new NextResponse("Category id is required", { status: 400 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (typeof isRequired !== 'boolean') {
            return new NextResponse("isRequired invalid", { status: 400 })
        }

        // if (!description) {
        //     return new NextResponse("Description is required", { status: 400 })
        // }

        const lastAdditionalItemCategory = await prismadb.additionalItemCategory.findFirst({
            orderBy: {
                createdAt: "desc"
            }
        })
        
        const newAdditionalItemCategory = await prismadb.additionalItemCategory.create({
            data: {
                name,
                description,
                maxQtdItems,
                status,
                isRequired,
                order: lastAdditionalItemCategory ? (lastAdditionalItemCategory?.order + 1) : 0,
                productIds: {
                    set: productIds
                },
                additionalItemsIds: {
                    set: additionalItemsIds
                }
            }
        })

        if (additionalItemsIds?.length) {
            await prismadb.additionalItem.updateMany({
                where: {
                    id: {
                        in: additionalItemsIds
                    }
                },
                data: {
                    additionalItemCategoryIds: {
                        push: newAdditionalItemCategory.id
                    },
                }
            })
        }

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

export async function PATCH(
    request: Request,
) {
    try {
        const body = await request.json();

        const {
            data
        } = body;

        const additionalItemCategories = await prismadb.additionalItemCategory.findMany()

        if (additionalItemCategories.length !== data.length) {
            return new NextResponse("Categories invalids", { status: 400 })
        }

        for (const additionalItemCategory of data) {
            const index = data.indexOf(additionalItemCategory)

            await prismadb.additionalItemCategory.update({
                where: {
                    id: additionalItemCategory.id
                },
                data: {
                    order: index
                }
            })
        }

        return NextResponse.json({})
    } catch(error) {
        console.log('[ADDITIONAL_ITEM_CATEGORY_PATCH', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}