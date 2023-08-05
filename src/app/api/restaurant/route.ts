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

        return new NextResponse("error", { status: 400 })

        const newRestaurant = await prismadb.restaurant.create({
            data:{
                address: {
                    create: {

                    }
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


export async function PATCH(
    request: Request
) {
    try {
        const body = await request.json();

        const {
            name,
            phone,
            whatsapp,
            email,
            logo,
            colorDetails,
            colorHeader,
            address: {
                streetAddress,
                number,
                city,
                complement,
                state,
                country,
                neighborhood,
                zipCode,
            }
        } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!whatsapp) {
            return new NextResponse("Whatsapp is required", { status: 400 })
        }

        if (!email) {
            return new NextResponse("Email is required", { status: 400 })
        }

        if (!colorDetails) {
            return new NextResponse("Details color is required", { status: 400 })
        }

        if (!colorHeader) {
            return new NextResponse("Header color is required", { status: 400 })
        }

        if (!streetAddress) {
            return new NextResponse("Street Address is required", { status: 400 })
        }

        if (!number) {
            return new NextResponse("Number is required", { status: 400 })
        }

        if (!city) {
            return new NextResponse("City is required", { status: 400 })
        }

        if (!state) {
            return new NextResponse("State is required", { status: 400 })
        }

        if (!country) {
            return new NextResponse("Country is required", { status: 400 })
        }

        if (!neighborhood) {
            return new NextResponse("Neighborhood is required", { status: 400 })
        }

        if (!zipCode) {
            return new NextResponse("Zip Code is required", { status: 400 })
        }

        const restaurant = await prismadb.restaurant.findFirst()

        const restaurantUpdate = await prismadb.restaurant.update({
            where: {
                id: restaurant?.id
            },
            data: {
                name,
                logo,
                phone,
                whatsapp,
                colorDetails,
                colorHeader,
                email,
                address: {
                    update: {
                        data: {
                            city,
                            complement,
                            country,
                            neighborhood,
                            number,
                            state,
                            streetAddress,
                            zipCode
                        }
                    }
                }
            },
            include: {
                address: true,
            }
        })

        return NextResponse.json(restaurantUpdate)
    } catch(error) {
        console.log('[RESTAURANT_PATCH', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}