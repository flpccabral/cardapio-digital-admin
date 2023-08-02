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
                id: params.productId,
            },
            include: {
                images: true,
                additionalItemCategories: {
                    include: {
                        additionalItems: true
                    }
                }
            }
        })

        return NextResponse.json(product)
    } catch(error) {
        console.log('[PRODUCT_GET', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const body = await request.json();

        const {
            name,
            description,
            price,
            images,
            status,
            categoryId,
            additionalItemCategoryIds
        } = body;

        if (!params.productId) {
            return new NextResponse("Product id is require", { status: 400 })
        }
        
        if (!name && !description && !price && !categoryId && (status || !status)) {
            const updateStatus = await prismadb.product.update({
                where: {
                    id: params.productId,
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

        if (categoryId) {
            const category = await prismadb.category.findUnique({
                where: {
                    id: categoryId
                }
            })

            if (!category) {
                return new NextResponse("Category id not exist", { status: 404 })
            }
        }

        // let query = []

        // if (additionalItemCategoryIds?.length) {
        //     query = additionalItemCategoryIds
        // }


        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            }
        })

        if (product?.additionalItemCategoryIds.length) {
            const additionalItemCategories = await prismadb.additionalItemCategory.findMany({
                where: {
                    id: {
                        in: product.additionalItemCategoryIds
                    }
                }
            })
    
            for (const additionalItemCategory of additionalItemCategories) {
                const productIds = additionalItemCategory.productIds.filter((productId) => productId !== params.productId)
    
                await prismadb.additionalItemCategory.updateMany({
                    where: {
                        id: {
                            in: product.additionalItemCategoryIds
                        }
                    },
                    data: {
                        productIds: {
                            set: productIds
                        }
                    }
                })
            }
        }



        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                description,
                price,
                categoryId,
                status,
                images: {
                    deleteMany: {}
                },
                additionalItemCategoryIds: {
                    set: additionalItemCategoryIds
                }
            }
        })
        
        const productUpdate = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    create: images?.map((image: { url: string }) => ({
                        url: image.url
                    }))
                },
            },
            include: {
                images: true
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
                        push: params.productId
                    }
                }
            })
        }

        return NextResponse.json(productUpdate)
    } catch(error) {
        console.log('[PRODUCT_PATCH', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {

        if (!params.productId) {
            return new NextResponse("Product id is require", { status: 400 })
        }

        const product = await prismadb.product.delete({
            where: {
                id: params.productId,
            }
        })

        if (product.additionalItemCategoryIds?.length) {
            const additionalItemCategories = await prismadb.additionalItemCategory.findMany({
                where: {
                    id: {
                        in: product.additionalItemCategoryIds
                    }
                }
            })
    
            for (const additionalItemCategory of additionalItemCategories) {
                const productIds = additionalItemCategory.productIds.filter((productId) => productId !== params.productId)
    
                await prismadb.additionalItemCategory.updateMany({
                    where: {
                        id: {
                            in: product.additionalItemCategoryIds
                        }
                    },
                    data: {
                        productIds: {
                            set: productIds
                        }
                    }
                })
            }
        }

        return NextResponse.json(product)
    } catch(error) {
        console.log('[PRODUCT_DELETE', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}