import prismadb from '@/lib/prismadb';
import getSession from './getSession'

export default async function getAdditionalItems() {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return []
        }


        const additionalItems = await prismadb.additionalItem.findMany({
            include: {
                additionalItemCategory: true
            },
            orderBy: {
                price: 'asc'
            }
        })

        if (!additionalItems) {
            return []
        }

        return additionalItems;
    } catch(error) {
        return [];
    }
}