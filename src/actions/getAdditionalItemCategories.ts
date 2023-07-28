import prismadb from '@/lib/prismadb';
import getSession from './getSession'

export default async function getAdditionalItemCategories() {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return []
        }


        const additionalItemCategory = await prismadb.additionalItemCategory.findMany({
            include: {
                products: {
                    include: {
                        images: true,
                    }
                },
                additionalItems: true
            }
        })

        if (!additionalItemCategory) {
            return []
        }

        return additionalItemCategory;
    } catch(error) {
        return [];
    }
}