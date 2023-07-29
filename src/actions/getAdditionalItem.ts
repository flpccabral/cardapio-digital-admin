import prismadb from '@/lib/prismadb';
import getSession from './getSession'

export default async function getAdditionalItem(additionalItemId: string) {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null
        }


        const additionalItem = await prismadb.additionalItem.findUnique({
            where: {
                id: additionalItemId
            },
            include: {
                additionalItemCategory: true,
            }
        })

        if (!additionalItem) {
            return null
        }

        return additionalItem;
    } catch(error) {
        return null;
    }
}