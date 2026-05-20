import {useFetchAllInformation} from "../src/features/information/hook";
import {Notification} from "./layouts/notification";
import * as React from "react";
import {OtherInfo} from "@/components/dashboard/Overview/OtherInfo";

export const InformationList = () => {
    const { allInformation } = useFetchAllInformation()

    const isUrl = (str: string) => /^https?:\/\/.+/.test(str.trim())

    const components = allInformation.map((information) => {
        const contentIsUrl = isUrl(information.content)
        return (
            <OtherInfo
                infoName={""}
                infoContent={information.title}
                infoSubContent={contentIsUrl ? undefined : information.content}
                link={contentIsUrl ? information.content.trim() : undefined}
                key={information.id}
            />
        )
    })

    return (
        <>
            {components}
        </>
    )
}
