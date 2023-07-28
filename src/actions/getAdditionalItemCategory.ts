import prismadb from '@/lib/prismadb';
import getSession from './getSession'

export default async function getAdditionalItemCategory(additionalItemCategoryId: string) {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null
        }


        const additionalItemCategory = await prismadb.additionalItemCategory.findUnique({
            where: {
                id: additionalItemCategoryId
            },
            include: {
                additionalItems: true,
                products: true
            }
        })

        if (!additionalItemCategory) {
            return null
        }

        return additionalItemCategory;
    } catch(error) {
        return null;
    }
}