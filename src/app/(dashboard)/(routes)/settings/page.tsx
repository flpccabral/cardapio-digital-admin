import getRestaurant from "@/actions/getRestaurant";
import SettingsForm from "./components/SettingsForm";

const SettingsPage = async () => {
    const restaurant = await getRestaurant();

    return (
        <>
            <SettingsForm initialDate={restaurant}/>
        </>
    )
}

export default SettingsPage;