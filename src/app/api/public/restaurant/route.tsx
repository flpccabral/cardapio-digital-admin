import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const revalidate = 0

export async function GET(
    request: Request,
) {
    try {
        const body = await request.json();

        const restaurant = await prismadb.restaurant.findFirst({
            include: {
                address: true
            }
        })

        return NextResponse.json(restaurant);
    } catch(error) {
        console.log('[PUBLIC_RESTAURANT_GET]', error)
        return new NextResponse("Interal error", { status: 500 })
    }
}