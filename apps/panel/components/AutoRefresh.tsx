import {useInterval} from "react-use";

export default function AutoRefresh() {
    const REFRESH_INTERVAL = 1000 * 60 * 5
    useInterval(
        () => {
            console.log("refresh")
            window.location.reload()
        },
        REFRESH_INTERVAL
    )
    return null
}
