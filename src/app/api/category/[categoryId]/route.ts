import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { categoryId: string } }
) {
    try {

        if (!params.categoryId) {
            return new NextResponse("Category id is require", { status: 400 })
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
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

        return NextResponse.json(category)
    } catch(error) {
        console.log('[CATEGORY_GET', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        const body = await request.json();

        const {
            name,
        } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!params.categoryId) {
            return new NextResponse("Category id is require", { status: 400 })
        }

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
            }
        })

        return NextResponse.json(category)
    } catch(error) {
        console.log('[CATEGORY_PATCH', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { categoryId: string } }
) {
    try {

        if (!params.categoryId) {
            return new NextResponse("Category id is require", { status: 400 })
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include: {
                products: true
            }
        })

        if (category?.products.length) {
            return new NextResponse("There are products in this category", { status: 403 })
        }

        const deletedCategory = await prismadb.category.delete({
            where: {
                id: params.categoryId,
            }
        })

        return NextResponse.json(deletedCategory)
    } catch(error) {
        console.log('[CATEGORY_DELETE', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}