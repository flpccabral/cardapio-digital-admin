import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
) {
    try {
        const restaurants = await prismadb.restaurant.findMany({
            include: {
                address: true
            }
        })

        return NextResponse.json(restaurants);
    } catch(error) {
        console.log('[RESTAURANTS_GET]', error)
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
            logo,
            phone,
            whatsapp,
            email,
            colorHeader,
            colorDetails,
            address,
        } = body;
        
        // if (!categoryId) {
        //     return new NextResponse("Category id is required", { status: 400 })
        // }

        // if (!name) {
        //     return new NextResponse("Name is required", { status: 400 })
        // }

        const newRestaurant = await prismadb.restaurant.create({
            data:{
                address: {

                }
            },
            include: {
                address: true
            }
        })

        return NextResponse.json(newRestaurant);
    } catch(error) {
        console.log('[RESTAURANT_POST]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}