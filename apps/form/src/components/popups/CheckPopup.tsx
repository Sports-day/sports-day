"use client";

import CheckPopupBase, { type CheckPopupBaseProps } from "./CheckPopupBase";

type CheckPopupProps = Omit<CheckPopupBaseProps, "refetchQueries">;

export default function CheckPopup({ teamid, open, setOpen }: CheckPopupProps) {
  return (
    <CheckPopupBase
      teamid={teamid}
      open={open}
      setOpen={setOpen}
      refetchQueries={["GetSceneSport"]}
    />
  );
}
