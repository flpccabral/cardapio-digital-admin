import prismadb from "@/lib/prismadb";
import { CategoriesClient } from "./components/client";
import { CategoryColumn } from "./components/columns";
import { format } from "date-fns";
import getCategories from "@/actions/getCategories";

export const revalidate = 0

const CategoriesPage = async () => {
    const categories = await getCategories()

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        qtdProducts: item.products.length.toString(),
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }))

    return (
        <>
            <CategoriesClient data={formattedCategories}/>
        </>
    )
}

export default CategoriesPage;