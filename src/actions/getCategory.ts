import prismadb from '@/lib/prismadb';
import getSession from './getSession'

export default async function getCategory(categoryId: string) {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: categoryId,
            },
            include: {
                products: {
                    include: {
                        category: true,
                        additionalItemCategories: true,
                        images: true
                    }
                }
            }
        })

        if (!category) {
            return null
        }

        return category;
    } catch(error) {
        return null;
    }
}