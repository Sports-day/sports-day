"use client";

import SceneStatusCardLayout from "@/components/cards/AboutConfirmPage/SceneStatusCardLayout";
import { useConflictedScenes } from "@/components/cards/AboutConfirmPage/hooks/useConflictedScenes";

export default function Conflicted() {
  const items = useConflictedScenes();
  return <SceneStatusCardLayout title="重複" items={items} />;
}
