import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className="w-full">
                <div className="w-full max-w-screen-2xl mx-auto py-6 px-4 sm:px-8">
                    {children}
                </div>
            </div>
        </>
    )
}