import prismadb from '@/lib/prismadb';
import getSession from './getSession'

export default async function getRestaurant() {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null
        }

        const restaurant = await prismadb.restaurant.findMany({
            include: {
                address: true
            }
        })

        if (!restaurant) {
            return null
        }

        return restaurant[0];
    } catch(error) {
        return null;
    }
}