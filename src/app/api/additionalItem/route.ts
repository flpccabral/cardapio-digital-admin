import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request
) {
    try {
        const additionalItem = await prismadb.additionalItem.findMany()

        return NextResponse.json(additionalItem);
    } catch(error) {
        console.log('[ADDITIONAL_ITEM_GET]', error)
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
            price,
            additionalItemCategoryId,
        } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 })
        }

        if (!additionalItemCategoryId) {
            return new NextResponse("Additional Item Category Id is required", { status: 400 })
        }
        
        const additionalItemCategory = await prismadb.additionalItemCategory.findUnique({
            where: {
                id: additionalItemCategoryId
            }
        })

        if (!additionalItemCategory) {
            return new NextResponse("Additional Item Category Id not exist", { status: 404 })
        }
        
        const newAdditionalItem = await prismadb.additionalItem.create({
            data: {
                name,
                price,
                additionalItemCategoryId
            }
        })

        return NextResponse.json(newAdditionalItem);
    } catch(error) {
        console.log('[ADDITIONAL_ITEM_POST]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}