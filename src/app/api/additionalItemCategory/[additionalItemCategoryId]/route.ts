import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { additionalItemCategoryId: string } }
) {
    try {

        if (!params.additionalItemCategoryId) {
            return new NextResponse("Additional Item Category Id is require", { status: 400 })
        }

        const additionalItemCategory = await prismadb.additionalItemCategory.findUnique({
            where: {
                id: params.additionalItemCategoryId,
            },
            include: {
                additionalItems: true
            }
        })

        return NextResponse.json(additionalItemCategory)
    } catch(error) {
        console.log('[ADDITIONAL_ITEM_CATEGORY_GET', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { additionalItemCategoryId: string } }
) {
    try {
        const body = await request.json();

        const {
            name,
            description,
            maxQtdItems
        } = body;

        if (!params.additionalItemCategoryId) {
            return new NextResponse("Additional Item Category Id is require", { status: 400 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!description) {
            return new NextResponse("Description is required", { status: 400 })
        }

        if (!maxQtdItems) {
            return new NextResponse("Maximum amount of itens is required", { status: 400 })
        }

        const additionalItemCategory = await prismadb.additionalItemCategory.updateMany({
            where: {
                id: params.additionalItemCategoryId,
            },
            data: {
                name,
                description,
                maxQtdItems
            }
        })

        return NextResponse.json(additionalItemCategory)
    } catch(error) {
        console.log('ADDITIONAL_ITEM_CATEGORY_PATCH', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { additionalItemCategoryId: string } }
) {
    try {

        if (!params.additionalItemCategoryId) {
            return new NextResponse("Additional Item Category Id is require", { status: 400 })
        }

        const additionalItemCategory = await prismadb.additionalItemCategory.findUnique({
            where: {
                id: params.additionalItemCategoryId,
            },
            include: {
                additionalItems: true
            }
        })

        if (additionalItemCategory?.additionalItems.length) {
            return new NextResponse("There are additional items in this category", { status: 403 })
        }

        const deletedadditionalItemCategory = await prismadb.additionalItemCategory.delete({
            where: {
                id: params.additionalItemCategoryId,
            },
            include: {
                products: true
            }
        })

        if (deletedadditionalItemCategory.productIds?.length) {
            const products = await prismadb.product.findMany({
                where: {
                    id: {
                        in: deletedadditionalItemCategory.productIds
                    }
                }
            })
    
            for (const product of products) {
                const additionalItemCategoryIds = product.additionalItemCategoryIds.filter((additionalItemCategoryId) => additionalItemCategoryId !== params.additionalItemCategoryId)
    
                await prismadb.product.updateMany({
                    where: {
                        id: {
                            in: deletedadditionalItemCategory.productIds
                        }
                    },
                    data: {
                        additionalItemCategoryIds: {
                            set: additionalItemCategoryIds
                        }
                    }
                })
            }
        }

        return NextResponse.json(deletedadditionalItemCategory)
    } catch(error) {
        console.log('ADDITIONAL_ITEM_CATEGORY_DELETE', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}