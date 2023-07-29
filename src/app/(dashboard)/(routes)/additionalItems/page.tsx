import { AdditionalItemsClient } from "./components/client";
import { AdditionalItemColumn } from "./components/columns";
import getAdditionalItems from "@/actions/getAdditionalItems";

const AdditionalItemsPage = async () => {
    const additionalItems = await getAdditionalItems()
    
    const formattedAdditionalItems: AdditionalItemColumn[] = additionalItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        status: item.status,
        qtdAdditionalItemCategory: item.additionalItemCategoryIds.length.toString()
    }))

    return (
        <>
            <AdditionalItemsClient data={formattedAdditionalItems}/>
        </>
    )
}

export default AdditionalItemsPage;