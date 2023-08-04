import prismadb from '@/lib/prismadb';
import getSession from './getSession'

export default async function getProducts() {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return []
        }

        const products = await prismadb.product.findMany({
            include: {
                images: true,
                category: true,
                additionalItemCategories: true,
            },
            orderBy: {
                price: 'asc'
            }
        })

        if (!products) {
            return []
        }

        return products;
    } catch(error) {
        return [];
    }
}