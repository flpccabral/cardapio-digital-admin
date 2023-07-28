import AdditionalItemCategoryForm from "./components/AdditionalItemCategoryForm";
import getAdditionalItemCategory from "@/actions/getAdditionalItemCategory";
import getAdditionalItems from "@/actions/getAdditionalItems";
import getProducts from "@/actions/getProducts";

const AdditionalItemCategoryPage = async ({
    params
}: {
    params: { additionalCategoryId: string }
}) => {
    const additionalItemCategory = await getAdditionalItemCategory(params.additionalCategoryId)
    const product = await getProducts()
    const additionalItems = await getAdditionalItems()

    const formattedProducts: { value: string, label: string}[] = product.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const formattedadditionalItems: { value: string, label: string}[] = additionalItems.map((item) => ({
        label: item.name,
        value: item.id
    }))

    return (
        <>
            <AdditionalItemCategoryForm initialDate={additionalItemCategory} products={formattedProducts} additionalItems={formattedadditionalItems}/>
        </>
    )
}

export default AdditionalItemCategoryPage;