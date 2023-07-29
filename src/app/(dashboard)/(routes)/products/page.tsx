import prismadb from "@/lib/prismadb";
import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import getProducts from "@/actions/getProducts";

export const revalidate = 0

const ProductsPage = async () => {
    const products = await getProducts()

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category.name,
        price: item.price.toString(),
        status: item.status,
        image: item.images[0]?.url
    }))

    return (
        <>
            <ProductsClient data={formattedProducts}/>
        </>
    )
}

export default ProductsPage;