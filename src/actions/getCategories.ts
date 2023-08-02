import prismadb from '@/lib/prismadb';
import getSession from './getSession'

export default async function getCategories() {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return []
        }


        const category = await prismadb.category.findMany({
            include: {
                products: true,
            },
            orderBy: {
                order: 'asc'
            }
        })

        if (!category) {
            return []
        }

        return category;
    } catch(error) {
        return [];
    }
}