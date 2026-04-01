"use client";

import SceneStatusCardLayout from "@/components/cards/AboutConfirmPage/SceneStatusCardLayout";
import { useConflictedScenes } from "@/components/cards/AboutConfirmPage/hooks/useConflictedScenes";

export default function Conflicted() {
  const { items, loading, error } = useConflictedScenes();
  const statusMessage = loading
    ? "読み込み中..."
    : error
      ? "データの取得に失敗しました"
      : undefined;
  return <SceneStatusCardLayout title="重複" items={items} statusMessage={statusMessage} />;
}
