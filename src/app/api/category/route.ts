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

        const newCategory = await prismadb.category.create({
            data: {
                name
            }
        })

        return NextResponse.json(newCategory);
    } catch(error) {
        console.log('[CATEGORY_POST]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}