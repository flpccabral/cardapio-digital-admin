import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    

    // if (!userId) {
    //     redirect('/sign-in');
    // }

    // const store = await prismadb.store.findFirst({
    //     where: {
    //         id: params.storeId,
    //         userId
    //     }
    // })

    // if (!store) {
    //     redirect('/')
    // }

    return (
        <>
            {/* <Navbar /> */}
            {children}
        </>
    )
}