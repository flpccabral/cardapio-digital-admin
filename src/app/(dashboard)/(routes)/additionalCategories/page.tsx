import prismadb from "@/lib/prismadb";
import { AdditionalCategoriesClient } from "./components/client";
import { AdditionalCategoryColumn } from "./components/columns";

const ProductsPage = async () => {
    const additionalCategories = await prismadb.additionalItemCategory.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            products: {
                include: {
                    images: true,
                }
            },
            additionalItems: true
        }
    })   
    
    const formattedProducts: AdditionalCategoryColumn[] = additionalCategories.map((item) => ({
        id: item.id,
        name: item.name,
        maxQtdItems: item.maxQtdItems.toString(),
        qtdProducts: item.products.length.toString(),
        qtdAdditionalItems: item.additionalItems.length.toString()
    }))

    return (
        <>
            <AdditionalCategoriesClient data={formattedProducts}/>
        </>
    )
}

export default ProductsPage;