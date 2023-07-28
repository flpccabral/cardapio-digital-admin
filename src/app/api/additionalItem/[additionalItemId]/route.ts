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
            additionalItemCategoryId
        } = body;

        if (!params.additionalItemId) {
            return new NextResponse("Additional Item Id is require", { status: 400 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 })
        }

        if (additionalItemCategoryId) {
            const additionalItemCategory = await prismadb.additionalItemCategory.findUnique({
                where: {
                    id: additionalItemCategoryId
                }
            })
    
            if (!additionalItemCategory) {
                return new NextResponse("Additional Item Category Id not exist", { status: 404 })
            }
        }

        const additionalItem = await prismadb.additionalItem.updateMany({
            where: {
                id: params.additionalItemId,
            },
            data: {
                name,
                price,
                additionalItemCategoryId
            }
        })

        return NextResponse.json(additionalItem)
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

        return NextResponse.json(additionalItem)
    } catch(error) {
        console.log('ADDITIONAL_ITEM_DELETE', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}