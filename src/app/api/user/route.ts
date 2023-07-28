import bcrypt from 'bcrypt'
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

// export async function GET(
//     request: Request,
// ) {
//     try {
//         const users = await prismadb.user.findMany()

//         return NextResponse.json(users);
//     } catch(error) {
//         console.log('[USER_GET]', error)
//         return new NextResponse("Interal error", { status: 500 })
//     }
// }


export async function POST(
    request: Request
) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            password,
            confirmPassword
        } = body

        return NextResponse.json(null);

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!email) {
            return new NextResponse("Email is required", { status: 400 })
        }

        if (!password) {
            return new NextResponse("Password is required", { status: 400 })
        }

        if (!confirmPassword) {
            return new NextResponse("Confirm Password is required", { status: 400 })
        }

        if (confirmPassword !== password) {
            return new NextResponse("Passwords do not match", { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        })

        return NextResponse.json(user);
    } catch(error: any) {
        console.log('[USER_POST]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}