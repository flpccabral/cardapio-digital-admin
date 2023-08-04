import NavSwitcher from "@/components/NavSwitcher";
import Sidebar from "@/components/Sidebar";

const Navbar = () => {

    return (
        <div className="border-b w-full">
            <div className="flex h-16 items-center px-4 max-w-screen-2xl mx-auto">
                <NavSwitcher />
                {/* <MainNav className="mx-6"/> */}
                <div className="ml-auto flex items-center space-x-4">
                    {/* <ModeToggle /> */}
                    <Sidebar />
                </div>
            </div>
        </div>
    )
}

export default Navbar;