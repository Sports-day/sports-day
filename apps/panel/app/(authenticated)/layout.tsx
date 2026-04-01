import {Navigation} from "@/components/layouts/navigation";
import {Outlet} from "react-router-dom";

export default function AuthenticatedLayout() {
    return (
        <>
            <Navigation/>
            <Outlet/>
        </>
    )
}
