"use client";

import SceneStatusCardLayout from "@/components/cards/AboutConfirmPage/SceneStatusCardLayout";
import { useNotSelectedScenes } from "@/components/cards/AboutConfirmPage/hooks/useNotSelectedScenes";

export default function NotSelected() {
  const items = useNotSelectedScenes();
  return <SceneStatusCardLayout title="未登録" items={items} />;
}
