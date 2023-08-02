import getCategory from "@/actions/getCategory";
import CategoryForm from "./components/CategoryForm";
import { ProductsClient } from "@/app/(dashboard)/(routes)/products/components/client";
import { Separator } from "@/components/ui/separator";

export const revalidate = 0

const CategoryPage = async ({
    params
}: {
    params: { categoryId: string }
}) => {
    const category = await getCategory(params.categoryId)

    const formattedProducts = category?.products?.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category.name,
        price: item.price.toString(),
        status: item.status,
        image: item.images[0]?.url
    }))

    return (
        <div className="space-y-16">
            <CategoryForm initialDate={category}/>
            <Separator />
            {params.categoryId !== 'new' && (
                <ProductsClient data={formattedProducts || []}/>
            )}
        </div>
    )
}

export default CategoryPage;