import {useInterval} from "react-use";

export default function AutoRefresh() {
    const REFRESH_INTERVAL = 1000 * 60 * 5
    useInterval(
        () => {
            window.location.reload()
        },
        REFRESH_INTERVAL
    )
    return null
}
