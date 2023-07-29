import getCategories from "@/actions/getCategories";
import ProductFormProps from "./components/ProductForm";
import getProduct from "@/actions/getProduct";
import getAdditionalItemCategories from "@/actions/getAdditionalItemCategories";

export const revalidate = 0

const CategoryPage = async ({
    params
}: {
    params: { productId: string }
}) => {
    const product = await getProduct(params.productId)
    const categories = await getCategories()
    const additionalItemCategories = await getAdditionalItemCategories()

    const formattedAdditionalItemCategories: { value: string, label: string}[] = additionalItemCategories.map((item) => ({
        label: item.name,
        value: item.id
    }))

    return (
        <>
            <ProductFormProps initialDate={product} categories={categories} additionalItemCategories={formattedAdditionalItemCategories}/>
        </>
    )
}

export default CategoryPage;