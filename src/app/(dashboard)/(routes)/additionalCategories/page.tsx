import { AdditionalCategoriesClient } from "./components/client";
import { AdditionalCategoryColumn } from "./components/columns";
import getAdditionalItemCategories from "@/actions/getAdditionalItemCategories";

const AdditionalCategoriesPage = async () => {
    const additionalCategories = await getAdditionalItemCategories()
    
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

export default AdditionalCategoriesPage;