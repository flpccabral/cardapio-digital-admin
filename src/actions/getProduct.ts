import prismadb from '@/lib/prismadb';
import getSession from './getSession'

export default async function getProduct(productId: string) {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                images: true,
                category: true,
                additionalItemCategories: true,
            }
        })

        if (!product) {
            return null
        }

        return product;
    } catch(error) {
        return null;
    }
}