"use client";

import SceneStatusCardLayout from "@/components/cards/AboutConfirmPage/SceneStatusCardLayout";
import { useNotSelectedScenes } from "@/components/cards/AboutConfirmPage/hooks/useNotSelectedScenes";

export default function NotSelected() {
  const { items, loading, error } = useNotSelectedScenes();
  const statusMessage = loading
    ? "読み込み中..."
    : error
      ? "データの取得に失敗しました"
      : undefined;
  return <SceneStatusCardLayout title="未登録" items={items} statusMessage={statusMessage} />;
}
