import getCategories from "@/actions/getCategories";
import ProductFormProps from "./components/ProductForm";
import getProduct from "@/actions/getProduct";
import getAdditionalItemCategories from "@/actions/getAdditionalItemCategories";
import { AdditionalCategoriesClient } from "@/app/(dashboard)/(routes)/additionalCategories/components/client";
import { Separator } from "@/components/ui/separator";

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

    const formattedAdditionalCategories = product?.additionalItemCategories?.map((item) => ({
        id: item.id,
        name: item.name,
        maxQtdItems: item.maxQtdItems.toString(),
        qtdProducts: item.products.length.toString(),
        qtdAdditionalItems: item.additionalItems.length.toString(),
        status: item.status,
        order: item.order
    }))

    return (
        <div className="space-y-16">
            <ProductFormProps initialDate={product} categories={categories} additionalItemCategories={formattedAdditionalItemCategories}/>
            <Separator />
            {params.productId !== 'new' && (
                <AdditionalCategoriesClient data={formattedAdditionalCategories || []}/>
            )}
        </div>
    )
}

export default CategoryPage;