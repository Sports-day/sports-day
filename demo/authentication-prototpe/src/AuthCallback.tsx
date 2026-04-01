// src/AuthCallback.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userManager } from "./authentication";

function AuthCallback() {
  // 開発環境（Strict Mode）でuseEffectが2回呼ばれるのを防ぐためのフラグ
  const isCallbackRunning = useRef(false);
  // ページ遷移（リダイレクト）を簡単にやるためのフック
  const navigate = useNavigate();

  useEffect(() => {
    // iframe 内からのサイレントコールバックの場合（トークン自動更新用）
    if (window.self !== window.top) {
      userManager.signinSilentCallback();
      return;
    }

    if (isCallbackRunning.current) return;
    isCallbackRunning.current = true;

    // Keycloakから戻ってきたときの処理
    userManager
      .signinRedirectCallback()
      .then(() => {
        // 成功したら、トップページ（/）に遷移させる
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("Callback error:", err);
      });
  }, [navigate]);

  return <div>認証を処理中... 少しお待ちください</div>;
}

export default AuthCallback;
