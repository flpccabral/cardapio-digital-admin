import AdditionalItemCategoryForm from "./components/AdditionalItemCategoryForm";
import getAdditionalItemCategory from "@/actions/getAdditionalItemCategory";
import getAdditionalItems from "@/actions/getAdditionalItems";
import getProducts from "@/actions/getProducts";
import { Separator } from "@/components/ui/separator";
import { AdditionalItemsClient } from "@/app/(dashboard)/(routes)/additionalItems/components/client";

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

    const formattedAdditionalItems = additionalItemCategory?.additionalItems?.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        status: item.status,
        qtdAdditionalItemCategory: item.additionalItemCategoryIds.length.toString()
    }))

    return (
        <div className="space-y-16">
            <AdditionalItemCategoryForm initialDate={additionalItemCategory} products={formattedProducts} additionalItems={formattedadditionalItems}/>
            <Separator />
            {params.additionalCategoryId !== 'new' && (
                <AdditionalItemsClient data={formattedAdditionalItems || []}/>
            )}
        </div>
    )
}

export default AdditionalItemCategoryPage;