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

        return NextResponse.json(restaurants[0]);
    } catch(error) {
        console.log('[PUBLIC_RESTAURANTS_GET]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}