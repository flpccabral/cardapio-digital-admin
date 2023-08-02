import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { additionalItemId: string } }
) {
    try {

        if (!params.additionalItemId) {
            return new NextResponse("Additional Item Id is require", { status: 400 })
        }

        const additionalItem = await prismadb.additionalItem.findUnique({
            where: {
                id: params.additionalItemId,
            }
        })

        return NextResponse.json(additionalItem)
    } catch(error) {
        console.log('[ADDITIONAL_ITEM_GET', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { additionalItemId: string } }
) {
    try {
        const body = await request.json();

        const {
            name,
            price,
            status,
            additionalItemCategoryIds
        } = body;

        if (!params.additionalItemId) {
            return new NextResponse("Additional Item Id is require", { status: 400 })
        }

        if (!name && !price && (status || !status)) {
            const updateStatus = await prismadb.additionalItem.update({
                where: {
                    id: params.additionalItemId,
                },
                data: {
                    status: !status
                }
            })

            return NextResponse.json(updateStatus)
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 })
        }


        const additionalItem = await prismadb.additionalItem.findUnique({
            where: {
                id: params.additionalItemId,
            }
        })

        if (additionalItem?.additionalItemCategoryIds.length) {
            const additionalItemCategories = await prismadb.additionalItemCategory.findMany({
                where: {
                    id: {
                        in: additionalItem.additionalItemCategoryIds
                    }
                }
            })
    
            for (const additionalItemCategory of additionalItemCategories) {
                const additionalItemsIds = additionalItemCategory.additionalItemsIds.filter((additionalItemsId) => additionalItemsId !== params.additionalItemId)
    
                await prismadb.additionalItemCategory.updateMany({
                    where: {
                        id: {
                            in: additionalItem.additionalItemCategoryIds
                        }
                    },
                    data: {
                        additionalItemsIds: {
                            set: additionalItemsIds
                        }
                    }
                })
            }
        }


        const updateAdditionalItem = await prismadb.additionalItem.updateMany({
            where: {
                id: params.additionalItemId,
            },
            data: {
                name,
                price,
                status,
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
                    additionalItemsIds: {
                        push: params.additionalItemId
                    }
                }
            })
        }

        return NextResponse.json(updateAdditionalItem)
    } catch(error) {
        console.log('ADDITIONAL_ITEM_PATCH', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { additionalItemId: string } }
) {
    try {

        if (!params.additionalItemId) {
            return new NextResponse("Additional Item Id is require", { status: 400 })
        }

        const additionalItem = await prismadb.additionalItem.delete({
            where: {
                id: params.additionalItemId,
            }
        })

        if (additionalItem.additionalItemCategoryIds?.length) {
            const additionalItemCategories = await prismadb.additionalItemCategory.findMany({
                where: {
                    id: {
                        in: additionalItem.additionalItemCategoryIds
                    }
                }
            })
    
            for (const additionalItemCategory of additionalItemCategories) {
                const additionalItemsIds = additionalItemCategory.additionalItemsIds.filter((additionalItemsId) => additionalItemsId !== params.additionalItemId)
    
                await prismadb.additionalItemCategory.updateMany({
                    where: {
                        id: {
                            in: additionalItem.additionalItemCategoryIds
                        }
                    },
                    data: {
                        additionalItemsIds: {
                            set: additionalItemsIds
                        }
                    }
                })
            }
        }

        return NextResponse.json(additionalItem)
    } catch(error) {
        console.log('ADDITIONAL_ITEM_DELETE', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}