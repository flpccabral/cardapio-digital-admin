import getSession from "@/actions/getSession";
import { redirect } from "next/navigation";

const LoginLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const session = await getSession();

    if (session?.user?.email) {
        redirect('/')
    }

    return (
        <>
            {children}
        </>
    )
}

export default LoginLayout;