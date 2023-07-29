import getAdditionalItem from "@/actions/getAdditionalItem";
import AdditionalItemItemForm from "./components/AdditionalItemForm";
import getAdditionalItemCategories from "@/actions/getAdditionalItemCategories";

const AdditionalItemItemPage = async ({
    params
}: {
    params: { additionalItemId: string }
}) => {
    const additionalItem = await getAdditionalItem(params.additionalItemId)
    const additionalItemCategories = await getAdditionalItemCategories()

    const formattedadditionalItems: { value: string, label: string}[] = additionalItemCategories.map((item) => ({
        label: item.name,
        value: item.id
    }))

    return (
        <>
            <AdditionalItemItemForm initialDate={additionalItem} additionalItemCategories={formattedadditionalItems}/>
        </>
    )
}

export default AdditionalItemItemPage;